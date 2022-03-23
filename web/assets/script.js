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
/* SLIDER */
/* ------ */

(function () {
  var sliderLeft = document.getElementById("slider-left");
  var sliderRight = document.getElementById("slider-right");
  var sliderFullspeed = document.getElementById("slider-fullspeed");
  var slider50 = document.getElementById("slider-50");
  var sliderStop = document.getElementById("slider-stop");
  var motors = {
    A: 0,
    B: 0,
  };
  var connect = function (motor, elem) {
    elem.addEventListener("input", function () {
      send();
    });
  };
  var send = function () {
    motors.A = parseInt(sliderLeft.value);
    motors.B = parseInt(sliderRight.value);
    socket.emit("motors", motors);
  };
  connect("A", sliderLeft);
  connect("B", sliderRight);
  sliderFullspeed.addEventListener("click", () => {
    sliderLeft.value = 50;
    sliderRight.value = 50;
    send();
  });
  slider50.addEventListener("click", () => {
    sliderLeft.value = 25;
    sliderRight.value = 25;
    send();
  });
  sliderStop.addEventListener("click", () => {
    sliderLeft.value = 0;
    sliderRight.value = 0;
    send();
  });
})();
