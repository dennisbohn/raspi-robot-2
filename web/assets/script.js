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
