const EventEmitter = require("events");
const Splitter = require("stream-split");
const Stream = require("stream");
const NALseparator = Buffer.from([0, 0, 0, 1]);
const child = require("child_process");

class Libcamera extends EventEmitter {
  constructor(options) {
    super();
    this.options = options || {};
    this.updateArguments();
    this.video_process = null;
  }
  updateArguments() {
    this.args = ["--nopreview"];
    for (var prop in this.options) {
      this.args.push("--" + prop, this.options[prop]);
    }
    this.args.push(
      "--codec",
      "h264",
      "--timeout",
      "0",
      "--profile",
      "baseline",
      "--flush",
      "--output",
      "-"
    );
  }
  start() {
    if (this.video_process !== null) return;
    this.video_process = child.spawn("libcamera-vid", this.args, {
      stdio: ["ignore", "pipe", "ignore"],
    });
    this.video_process.stdout
      .pipe(new Splitter(NALseparator))
      .pipe(
        new Stream.Transform({
          transform: function (videoChunk, encoding, callback) {
            this.push(videoChunk);
            callback();
          },
        })
      )
      .on("data", (data) => {
        this.emit("data", data);
      });
  }
  stop() {
    if (this.video_process === null) return;
    this.video_process.kill("SIGINT");
    this.video_process = null;
  }
}

module.exports = Libcamera;
