const VideoBufferReceiver = require("./VideoBufferReceiver.js");
const EventEmitter = require("events");

class VideoBuffer extends EventEmitter {
  constructor() {
    super();
    this.keyframe = 0;
    this.frames = [];
    this.sps = null;
    this.pps = null;
    this.pushVideoChunk = this.pushVideoChunk.bind(this);
    this.addReceiverSocket = this.addReceiverSocket.bind(this);
  }
  addReceiverSocket(socket) {
    return new VideoBufferReceiver(this, socket);
  }
  pushVideoChunk(videoChunk) {
    var videoChunkType = videoChunk[0] & 0b11111;

    if (videoChunkType === 1) {
      this.frames.push(videoChunk);
      this.emit("newVideoChunkAvailable");
    }
    if (videoChunkType === 5) {
      this.frames = [videoChunk];
      this.keyframe++;
      this.emit("newVideoChunkAvailable");
    }
    if (videoChunkType === 7) {
      this.sps = videoChunk;
      this.emit("headerVideoChunk", videoChunk);
    }
    if (videoChunkType === 8) {
      this.pps = videoChunk;
      this.emit("headerVideoChunk", videoChunk);
    }
  }
}

module.exports = VideoBuffer;
