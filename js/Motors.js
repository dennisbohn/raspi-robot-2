class Motors {
  constructor(pythonProcess) {
    this.py = pythonProcess;
  }
  speed(wheel, speed) {
    this.py.stdin.write(wheel + speed + "\n");
  }
  stop(wheel) {
    this.py.stdin.write(wheel + "0\n");
  }
}

module.exports = Motors;
