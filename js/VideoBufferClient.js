const EventEmitter = require("events");

class VideoBufferClient extends EventEmitter {
  constructor(videoBuffer) {
    super();
    this.videoBuffer = videoBuffer;
    this.maxBufferedChunks = 3;
    this.bufferedChunks = 0;
    this.sendChunk = this.sendChunk.bind(this);
    this.sendChunks = this.sendChunks.bind(this);
  }
  start() {
    this.keyframe = this.videoBuffer.keyframe;
    this.frame = 0;
    this.sendHeader();
    this.sendChunks();
    this.removeEventListeners();
    this.addEventListeners();
  }
  stop() {
    this.removeEventListeners();
  }
  addEventListeners() {
    this.videoBuffer.on("headerChunk", this.sendChunk);
    this.videoBuffer.on("newChunkAvailable", this.sendChunks);
  }
  removeEventListeners() {
    this.videoBuffer.removeListener("headerChunk", this.sendChunk);
    this.videoBuffer.removeListener("newChunkAvailable", this.sendChunks);
  }
  sendHeader() {
    if (this.videoBuffer.sps) this.sendChunk(this.videoBuffer.sps);
    if (this.videoBuffer.pps) this.sendChunk(this.videoBuffer.pps);
  }
  sendChunk(chunk) {
    this.emit("chunk", chunk);
  }
  sendChunks() {
    if (this.keyframe !== this.videoBuffer.keyframe) {
      this.keyframe = this.videoBuffer.keyframe;
      this.frame = 0;
    }
    while (
      this.bufferedChunks < this.maxBufferedChunks &&
      this.frame < this.videoBuffer.frames.length
    ) {
      this.bufferedChunks++;
      this.sendChunk(this.videoBuffer.frames[this.frame++]);
    }
  }
  chunkReceived() {
    this.bufferedChunks--;
    this.sendChunks();
  }
}

module.exports = VideoBufferClient;
