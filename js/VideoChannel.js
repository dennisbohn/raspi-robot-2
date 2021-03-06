const EventEmitter = require("events");
const VideoBuffer = require("./VideoBuffer");

class VideoChannel extends EventEmitter {
  constructor(socket, authKey) {
    super();
    this.videoChunkReceived = this.videoChunkReceived.bind(this);
    this.videoBuffer = new VideoBuffer();
    this.addReceiverSocket = this.videoBuffer.addReceiverSocket;
  }
  setBroadcaster(socket) {
    this.removeBroadcasterEventListeners();
    this.broadcaster = socket;
    this.addBroadcasterEventListeners();
  }
  removeBroadcasterEventListeners() {
    if (!this.broadcaster) return;
    this.broadcaster.removeAllListeners();
  }
  addBroadcasterEventListeners() {
    this.broadcaster.on("videoChunk", this.videoChunkReceived);
  }
  videoChunkReceived(videoChunk) {
    this.videoBuffer.pushVideoChunk(videoChunk);
    this.broadcaster.emit("videoChunkReceived");
  }
}

module.exports = VideoChannel;
