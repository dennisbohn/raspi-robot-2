const fs = require("fs");
const Motors = require("./js/Motors.js");
const VideoBuffer = require("./js/VideoBuffer.js");
const io = require("socket.io-client");
const config = JSON.parse(fs.readFileSync("config.json").toString());
const socket = io("wss://" + config.server.hostname + "/", {
  auth: { token: config.server.authToken },
});
const videoBuffer = new VideoBuffer();
const spawn = require("child_process").spawn;
const pythonProcess = spawn("python3", ["-u", "./js/Motors.py"]);
const motors = new Motors(pythonProcess);
const Libcamera = require("./js/Libcamera.js");

// Raspberry pi camera
const libcamera = new Libcamera(config.libcamera);

// Send all chunks to the videobuffer
libcamera.on("data", videoBuffer.pushVideoChunk);

// Start camera
libcamera.start();

// Connect to websocket
socket.on("connect", () => {
  videoBuffer.addReceiverSocket(socket);
});

socket.on("motors", (data) => {
  motors.setMotors(data);
});

socket.on("camera", function (value) {
  if (value === "start") libcamera.start();
  if (value === "stop") libcamera.stop();
});
