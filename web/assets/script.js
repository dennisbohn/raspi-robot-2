/* ------ */
/* PLAYER */
/* ------ */

const socket = io();
const player = new Player({
  size: {
    width: 1280,
    height: 720,
  },
});
document.getElementById("player").appendChild(player.canvas);
socket.on("videoChunk", (videoChunk) => {
  player.decode(new Uint8Array(videoChunk));
  socket.emit("videoChunkReceived");
});

/* ------ */
/* MOTORS */
/* ------ */

class Motors {
  constructor() {
    this.motors = {
      A: 0,
      B: 0,
    };
    this.send = this.send.bind(this);
  }
  normalize(speed) {
    return Math.min(100, Math.max(-100, parseInt(speed) || 0));
  }
  set A(speed) {
    this.motors.A = this.normalize(speed);
  }
  set B(speed) {
    this.motors.B = this.normalize(speed);
  }
  send() {
    socket.emit("motors", this.motors);
  }
}

var motors = new Motors();

/* ------ */
/* SLIDER */
/* ------ */

(function () {
  var sliderLeft = document.getElementById("slider-left");
  var sliderRight = document.getElementById("slider-right");
  var sliderFullspeed = document.getElementById("slider-fullspeed");
  var slider50 = document.getElementById("slider-50");
  var sliderStop = document.getElementById("slider-stop");
  var updateMotors = function () {
    motors.A = sliderRight.value;
    motors.B = sliderLeft.value;
    motors.send();
  };
  sliderFullspeed.addEventListener("click", () => {
    sliderLeft.value = 100;
    sliderRight.value = 100;
    updateMotors();
  });
  slider50.addEventListener("click", () => {
    sliderLeft.value = 50;
    sliderRight.value = 50;
    updateMotors();
  });
  sliderStop.addEventListener("click", () => {
    sliderLeft.value = 0;
    sliderRight.value = 0;
    updateMotors();
  });
  sliderLeft.addEventListener("input", () => {
    motors.A = sliderLeft.value;
    updateMotors();
  });
  sliderRight.addEventListener("input", () => {
    motors.B = sliderRight.value;
    updateMotors();
  });
})();

/* -------- */
/* JOYSTICK */
/* -------- */

(function () {
  var x, y;
  var active = false;
  var joystick = document.querySelector(".joystick");
  var button = joystick.querySelector(".joystick-button");
  var sliderLeft = document.getElementById("slider-left");
  var sliderRight = document.getElementById("slider-right");
  var updateMotors = function (x, y) {
    var l, r;
    l = Math.max(-100, Math.min(100, x * 100 - y * 100));
    r = Math.max(-100, Math.min(100, -x * 100 - y * 100));
    motors.A = r;
    motors.B = l;
    motors.send();
    sliderLeft.value = l;
    sliderRight.value = r;
  };
  var setJoystickPosition = function (x, y) {
    var sin, cos, angle;
    if (x !== 0 && y !== 0) {
      angle = Math.atan2(y, x);
      sin = Math.sin(angle);
      cos = Math.cos(angle);
      x = x > 0 ? Math.min(x, cos) : Math.max(x, cos);
      y = y > 0 ? Math.min(y, sin) : Math.max(y, sin);
    }
    button.style.left = (x + 1) * 50 + "%";
    button.style.top = (y + 1) * 50 + "%";
    updateMotors(x, y);
  };
  var start = function (e) {
    var joystickBox = joystick.getBoundingClientRect();
    var clientX = e.clientX || e.touches[0].clientX;
    var clientY = e.clientY || e.touches[0].clientY;
    active = true;
    x = ((clientX - joystickBox.x) / joystickBox.width) * 2 - 1;
    y = ((clientY - joystickBox.y) / joystickBox.height) * 2 - 1;
    setJoystickPosition(x, y);
  };
  var move = function (e) {
    var joystickBox = joystick.getBoundingClientRect();
    var clientX = e.clientX || e.touches[0].clientX;
    var clientY = e.clientY || e.touches[0].clientY;
    x = ((clientX - joystickBox.x) / joystickBox.width) * 2 - 1;
    y = ((clientY - joystickBox.y) / joystickBox.height) * 2 - 1;
    if (active) {
      setJoystickPosition(x, y);
      e.preventDefault();
    }
  };
  var stop = function (e) {
    active = false;
    setJoystickPosition(0, 0);
  };
  joystick.addEventListener("mousedown", start);
  joystick.addEventListener("touchstart", start);
  window.addEventListener("touchmove", move, { passive: false });
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", stop);
  window.addEventListener("touchend", stop);
})();

/* ----- */
/* VIDEO */
/* ----- */

(function () {
  var button = document.getElementById("video");
  button.textContent = "Video stoppen";
  button.className = "disable";
  button.addEventListener("click", () => {
    if (button.className === "disable") {
      socket.emit("camera", "stop");
      button.textContent = "Video starten";
      button.className = "enable";
    } else {
      socket.emit("camera", "start");
      button.textContent = "Video stoppen";
      button.className = "disable";
    }
  });
})();
