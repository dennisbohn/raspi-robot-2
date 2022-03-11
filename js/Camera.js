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
          transform: function (chunk, encoding, callback) {
            this.push(chunk);
            callback();
          },
        })
      )
      .on("data", (data) => {
        var type = data[0] & 0b11111;
        this.emit("chunk", { type, data });
      });
  }
}

module.exports = Camera;
