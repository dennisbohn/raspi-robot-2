const readFileSync = require("fs").readFileSync;
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer);
const VideoChannel = require("./js/VideoChannel.js");
const authToken = readFileSync(".authToken").toString().trim();

// Create channel
const robotVideoChannel = new VideoChannel();

io.on("connection", (socket) => {
  // Receiver
  if (!socket.handshake.auth.token) {
    robotVideoChannel.addReceiverSocket(socket);
  }
  // Broadcaster
  if (socket.handshake.auth.token === authToken) {
    robotVideoChannel.setBroadcaster(socket);
  }
});

httpServer.listen(3000);
