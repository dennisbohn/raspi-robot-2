const raspivid = require("raspivid");
const Splitter = require("stream-split");
const Stream = require("stream");
const NALseparator = Buffer.from([0, 0, 0, 1]);
const EventEmitter = require("events");

class Camera extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
  }

  start() {
    raspivid(this.options)
      .pipe(new Splitter(NALseparator))
      .pipe(
        new Stream.Transform({
          transform: function (videoChunk, encoding, callback) {
            this.push(videoChunk);
            callback();
          },
        })
      )
      .on("data", (videoChunk) => {
        this.emit("videoChunk", videoChunk);
      });
  }
}

module.exports = Camera;
