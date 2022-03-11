const VideoBufferClient = require("./VideoBufferClient.js");
const EventEmitter = require("events");

class VideoBuffer extends EventEmitter {
  constructor() {
    super();
    this.keyframe = 0;
    this.frames = [];
  }
  createClient() {
    return new VideoBufferClient(this);
  }
  pushChunk(chunk) {
    var chunkType = chunk[0] & 0b11111;

    if (chunkType === 7) {
      this.sps = chunk;
      this.emit("headerChunk", chunk);
    }

    if (chunkType === 8) {
      this.pps = chunk;
      this.emit("headerChunk", chunk);
    }

    if (chunkType === 5) {
      this.frames = [chunk];
      this.keyframe++;
      this.emit("newChunkAvailable");
    }

    if (chunkType === 1) {
      this.frames.push(chunk);
      this.emit("newChunkAvailable");
    }
  }
}

module.exports = VideoBuffer;
