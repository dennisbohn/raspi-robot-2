const Camera = require("./js/Camera.js");
const VideoBuffer = require("./js/VideoBuffer.js");

const camera = new Camera({
  width: 640,
  height: 360,
  framerate: 20,
  profile: "baseline",
  timeout: 0,
  bitrate: 1000000,
});

camera.on("chunk", (chunk) => {
  console.log(chunk.type);
});

camera.start();
