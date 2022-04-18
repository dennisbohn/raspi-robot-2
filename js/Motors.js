class Motors {
  constructor(pythonProcess) {
    this.line = 0;
    this.queue = {};
    this.speedTimeout = 0;
    this.stopTimeout = 0;
    this.changed = false;
    this.py = pythonProcess;
    this.setMotors = this.setMotors.bind(this);
    this.updateSpeed = this.updateSpeed.bind(this);
    this.stop = this.stop.bind(this);
    this.stdin = this.stdin.bind(this);
    this.stdout = this.stdout.bind(this);
    this.py.stdout.on("data", this.stdout);
  }
  setMotors(motors) {
    if (typeof motors === "object") {
      if (typeof motors.A === "number") this.queue.A = motors.A;
      if (typeof motors.B === "number") this.queue.B = motors.B;
    }
    this.changed = true;
    if (this.speedTimeout) return;
    this.updateSpeed();

    // stop timeout
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = 0;
    }
    if (this.queue.A === 0 && this.queue.B === 0) this.stop();

    // speed timeout
    this.speedTimeout = setTimeout(() => {
      if (this.changed) this.updateSpeed();
      this.speedTimeout = 0;
      if (this.queue.A === 0 && this.queue.B === 0) this.stop();
    }, 50);
  }
  updateSpeed() {
    var output = [];
    for (const [key, value] of Object.entries(this.queue)) {
      output.push(key + value);
    }
    this.stdin(output.join(" "));
    this.changed = false;
  }
  stop() {
    this.stopTimeout = setTimeout(() => {
      this.stdin("STOP");
      this.stopTimeout = 0;
    }, 200);
  }
  stdin(data) {
    this.py.stdin.write(data + "\n");
  }
  stdout(data) {
    var stdout = data.toString().trim();
    console.log(stdout);
  }
}

module.exports = Motors;
