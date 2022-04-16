const readFileSync = require("fs").readFileSync;
const Motors = require("./js/Motors.js");
const VideoBuffer = require("./js/VideoBuffer.js");
const io = require("socket.io-client");
const authToken = readFileSync(".authToken").toString().trim();
const socket = io("wss://beta.robot.bohn.media/", {
  auth: { token: authToken },
});
const videoBuffer = new VideoBuffer();
const spawn = require("child_process").spawn;
const pythonProcess = spawn("python3", ["-u", "./js/Motors.py"]);
const motors = new Motors(pythonProcess);
const Raspivid = require("./js/Raspivid.js");

// Raspberry pi camera
const raspivid = new Raspivid({
  width: 640,
  height: 360,
  framerate: 30,
  profile: "baseline",
  timeout: 0,
  bitrate: 1000000,
});

// Send all chunks to the videobuffer
raspivid.on("data", videoBuffer.pushVideoChunk);

// Start camera
raspivid.start();

// Connect to websocket
socket.on("connect", () => {
  videoBuffer.addReceiverSocket(socket);
});

socket.on("motors", (data) => {
  motors.setMotors(data);
});

socket.on("camera", function (value) {
  if (value === "start") raspivid.start();
  if (value === "stop") raspivid.stop();
});
