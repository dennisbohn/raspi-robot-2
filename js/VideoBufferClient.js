const EventEmitter = require("events");

class VideoBufferClient extends EventEmitter {
  constructor(videoBuffer) {
    super();
    this.videoBuffer = videoBuffer;
    this.maxBufferedChunks = 3;
    this.bufferedChunks = 0;
  }
  start() {
    this.keyframe = this.videoBuffer.keyframe;
    this.frame = 0;
    this.sendHeader();
    this.sendChunks();
    this.videoBuffer.on("chunk", this.sendChunks.bind(this));
  }
  sendHeader() {
    if (this.videoBuffer.sps) {
      this.emit("chunk", this.videoBuffer.sps);
    }
    if (this.videoBuffer.pps) {
      this.emit("chunk", this.videoBuffer.pps);
    }
    this.videoBuffer.on("header", (chunk) => {
      this.emit("chunk", chunk);
    });
  }
  sendChunks() {
    if (this.keyframe !== this.videoBuffer.keyframe) {
      this.keyframe = this.videoBuffer.keyframe;
      this.frame = 0;
    }
    while (this.videoBuffer.frames[this.frame]) {
      if (this.bufferedChunks === this.maxBufferedChunks) break;
      this.bufferedChunks++;
      this.emit("chunk", this.videoBuffer.frames[this.frame++]);
    }
  }
  chunkReceived() {
    this.bufferedChunks--;
    this.sendChunks();
  }
}

module.exports = VideoBufferClient;
