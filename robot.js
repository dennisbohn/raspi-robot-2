const readFileSync = require("fs").readFileSync;
const Camera = require("./js/Camera.js");
const Motors = require("./js/Motors.js");
const VideoBuffer = require("./js/VideoBuffer.js");
const io = require("socket.io-client");
const authToken = readFileSync(".authToken").toString().trim();
const socket = io("wss://robot.bohn.media/", {
  auth: { token: authToken },
});
const videoBuffer = new VideoBuffer();
const spawn = require("child_process").spawn;
const pythonProcess = spawn("python3", ["-u", "./js/Motors.py"]);
const motors = new Motors(pythonProcess);

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

// Hier beginnt der Spaß!!! :D
setTimeout(function () {
  motors.speed("a", 100);
  motors.speed("b", 100);
}, 3000);
