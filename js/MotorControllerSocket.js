class MotorControllerSocket {
  constructor(controller, socket) {
    this.controller = controller;
    this.socket = socket;
    this.addEventListeners();
  }
  addEventListeners() {
    this.socket.on("motors", (data) => {
      if (this.controller.receiver)
        this.controller.receiver.emit("motors", data);
    });
  }
}

module.exports = MotorControllerSocket;
