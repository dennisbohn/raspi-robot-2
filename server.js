const readFileSync = require("fs").readFileSync;
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer);
const MotorController = require("./js/MotorController.js");
const VideoChannel = require("./js/VideoChannel.js");
const authToken = readFileSync(".authToken").toString().trim();

// Create channel
const robotVideoChannel = new VideoChannel();

// Create motor controller
const robotMotorController = new MotorController();

// For testing
var robot = null;

io.on("connection", (socket) => {
  // Receiver
  if (!socket.handshake.auth.token) {
    robotVideoChannel.addReceiverSocket(socket);
    robotMotorController.addControllerSocket(socket);

    // For testing
    socket.on("camera", (value) => {
      if (robot) robot.emit("camera", value);
    });
  }
  // Broadcaster
  if (socket.handshake.auth.token === authToken) {
    robotVideoChannel.setBroadcaster(socket);
    robotMotorController.setReceiver(socket);

    // For testing
    robot = socket;
  }
});

httpServer.listen(3000);
