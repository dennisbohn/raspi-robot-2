class VideoBufferReceiver {
  constructor(videoBuffer, socket) {
    this.videoBuffer = videoBuffer;
    this.socket = socket;

    this.keyframe = this.videoBuffer.keyframe;
    this.frame = 0;
    this.maxBufferedVideoChunks = 3;
    this.bufferedVideoChunks = 0;

    this.sendVideoChunk = this.sendVideoChunk.bind(this);
    this.sendVideoChunks = this.sendVideoChunks.bind(this);
    this.videoChunkReceived = this.videoChunkReceived.bind(this);
    this.removeEventListeners = this.removeEventListeners.bind(this);

    this.sendVideoHeader();
    this.sendVideoChunks();
    this.removeEventListeners();

    this.videoBuffer.on("headerVideoChunk", this.sendVideoChunk);
    this.videoBuffer.on("newVideoChunkAvailable", this.sendVideoChunks);
    this.socket.on("videoChunkReceived", this.videoChunkReceived);
    this.socket.on("disconnect", this.removeEventListeners);
  }
  removeEventListeners() {
    this.videoBuffer.removeListener("headerVideoChunk", this.sendVideoChunk);
    this.videoBuffer.removeListener(
      "newVideoChunkAvailable",
      this.sendVideoChunks
    );
    this.socket.removeListener("videoChunkReceived", this.videoChunkReceived);
    this.socket.removeListener("disconnect", this.removeEventListeners);
  }
  sendVideoHeader() {
    if (this.videoBuffer.sps) this.sendVideoChunk(this.videoBuffer.sps);
    if (this.videoBuffer.pps) this.sendVideoChunk(this.videoBuffer.pps);
  }
  sendVideoChunk(chunk) {
    this.socket.emit("videoChunk", chunk);
  }
  sendVideoChunks() {
    if (this.keyframe !== this.videoBuffer.keyframe) {
      this.keyframe = this.videoBuffer.keyframe;
      this.frame = 0;
    }
    while (
      this.bufferedVideoChunks < this.maxBufferedVideoChunks &&
      this.frame < this.videoBuffer.frames.length
    ) {
      this.bufferedVideoChunks++;
      console.log(this.bufferedVideoChunks);
      this.sendVideoChunk(this.videoBuffer.frames[this.frame++]);
    }
  }
  videoChunkReceived() {
    this.bufferedVideoChunks--;
    this.bufferedVideoChunks = Math.max(this.bufferedVideoChunks, 0);
    this.sendVideoChunks();
  }
}

module.exports = VideoBufferReceiver;
