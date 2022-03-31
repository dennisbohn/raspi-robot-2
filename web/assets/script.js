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
    motors.A = sliderLeft.value;
    motors.B = sliderRight.value;
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
  var updateMotors = function (x, y) {
    var l, r;
    l = Math.max(-100, Math.min(100, x * 50 - y * 50));
    r = Math.max(-100, Math.min(100, -x * 50 - y * 50));
    motors.A = r;
    motors.B = l;
    motors.send();
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
  window.addEventListener("mousemove", function (e) {
    var joystickBox = joystick.getBoundingClientRect();
    x = ((e.clientX - joystickBox.x) / joystickBox.width) * 2 - 1;
    y = ((e.clientY - joystickBox.y) / joystickBox.height) * 2 - 1;
    if (active) {
      setJoystickPosition(x, y);
      e.preventDefault();
    }
  });
  joystick.addEventListener("mousedown", function (e) {
    active = true;
    setJoystickPosition(x, y);
  });
  window.addEventListener("mouseup", function (e) {
    active = false;
    setJoystickPosition(0, 0);
  });
})();
