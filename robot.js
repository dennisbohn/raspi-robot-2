const Camera = require("./js/Camera.js");
const VideoBuffer = require("./js/VideoBuffer.js");
const io = require("socket.io-client");
const socket = io("wss://robot.bohn.media/", {
  auth: { token: "t4QBBRKBiWMFEkrphqi8" },
});
const videoBuffer = new VideoBuffer();

// Raspberry pi camera
const camera = new Camera({
  width: 1280,
  height: 720,
  framerate: 30,
  profile: "baseline",
  timeout: 0,
  bitrate: 2500000,
});

// Send all chunks to the videobuffer
camera.on("videoChunk", videoBuffer.pushVideoChunk);

// Start camera
camera.start();

// Connect to websocket
socket.on("connect", () => {
  videoBuffer.addReceiverSocket(socket);
});
