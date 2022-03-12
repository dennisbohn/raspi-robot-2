const Camera = require("./js/Camera.js");
const VideoBuffer = require("./js/VideoBuffer.js");

const videoBuffer = new VideoBuffer();

// Raspberry pi camera
const camera = new Camera({
  width: 640,
  height: 360,
  framerate: 30,
  profile: "baseline",
  timeout: 0,
  bitrate: 1000000,
});

// Send all chunks to the videobuffer
camera.on("chunk", (chunk) => {
  videoBuffer.pushChunk(chunk);
});

// Create a videobuffer client to send video frames to the server
const videoBufferClient = videoBuffer.createClient();
videoBufferClient.on("chunk", (chunk) => {
  var chunkType = chunk[0] & 0b11111;
  videoBufferClient.chunkReceived();
});
videoBufferClient.start();

camera.start();
