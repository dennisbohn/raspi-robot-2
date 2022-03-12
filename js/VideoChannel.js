const EventEmitter = require("events");
const VideoBuffer = require("./VideoBuffer");

class VideoChannel extends EventEmitter {
  constructor(socket, authKey) {
    super();
    this.stats = "";
    this.videoChunkReceived = this.videoChunkReceived.bind(this);
    this.videoBuffer = new VideoBuffer();
    this.addReceiverSocket = this.videoBuffer.addReceiverSocket.bind(
      this.videoBuffer
    );
  }
  setBroadcaster(socket) {
    this.broadcaster = socket;
    this.addBroadcasterEventListeners();
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
