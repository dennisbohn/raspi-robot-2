// Modules
const Motors = require("./js/Motors.js");
const VideoBuffer = require("./js/VideoBuffer.js");
const Libcamera = require("./js/Libcamera.js");
const fs = require("fs");
const io = require("socket.io-client");
const ChildProcess = require("child_process");

// Load config
const configFile = __dirname + "/config.json";
if (!fs.existsSync(configFile)) process.exit();
const config = JSON.parse(fs.readFileSync("config.json").toString());
if (!config.server || !config.server.hostname || !config.server.authToken)
  process.exit();

// Connect to server
const socket = io("wss://" + config.server.hostname + "/", {
  auth: { token: config.server.authToken },
});

// Create video buffer for output stream
const videoBuffer = new VideoBuffer();

// Start motors
const pythonProcess = ChildProcess.spawn("python3", ["-u", "./js/Motors.py"]);
const motors = new Motors(pythonProcess);

// Start camera
const libcamera = new Libcamera(config.libcamera);

// Send all chunks to the videobuffer
libcamera.on("data", videoBuffer.pushVideoChunk);

// Start camera
libcamera.start();

// Connect to websocket
socket.on("connect", () => {
  videoBuffer.addReceiverSocket(socket);
});

// Motor controlls
socket.on("motors", (data) => {
  motors.setMotors(data);
});

// Camera controlls
socket.on("camera", function (value) {
  if (value === "start") libcamera.start();
  if (value === "stop") libcamera.stop();
});
