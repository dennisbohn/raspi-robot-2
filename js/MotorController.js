const MotorControllerSocket = require("./MotorControllerSocket");

class MotorController {
  constructor() {
    this.addControllerSocket = this.addControllerSocket.bind(this);
    this.setReceiver = this.setReceiver.bind(this);
  }
  addControllerSocket(socket) {
    return new MotorControllerSocket(this, socket);
  }
  setReceiver(socket) {
    this.receiver = socket;
    socket.on("disconnect", () => {
      if (this.receiver == socket) this.receiver = null;
    });
  }
}

module.exports = MotorController;
