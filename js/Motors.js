class Motors {
  constructor(pythonProcess) {
    this.line = 0;
    this.queue = {};
    this.timeout = null;
    this.changed = false;
    this.py = pythonProcess;
    this.setMotors = this.setMotors.bind(this);
    this.updateSpeed = this.updateSpeed.bind(this);
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
    if (this.timeout) return;
    this.updateSpeed();
    this.timeout = setTimeout(() => {
      if (this.changed) this.updateSpeed();
      this.timeout = null;
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
  stdin(data) {
    this.py.stdin.write(data + "\n");
  }
  stdout(data) {
    var stdout = data.toString().trim();
    console.log(stdout);
  }
}

module.exports = Motors;
