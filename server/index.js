const io = require("socket.io")(3000);

io.on("connection", socket => {
  socket.emit("client-log", [Object.keys(io.sockets.sockets)]);
  io.emit("users", Object.keys(io.sockets.sockets));
  socket.on("disconnect", () =>
    io.emit("users", Object.keys(io.sockets.sockets))
  );
  socket.emit("my-id", socket.id);

  socket.on("data-channel offer", (data) => {
    socket.to(data.receiver).emit("data-channel offer", data);
  });
  socket.on("data-channel answer", (data) => {
    socket.to(data.caller).emit("data-channel answer", data);
  });
  socket.on("new-ice-candidate", (data) => {
    socket.to(data.receiver).emit('new-ice-candidate', data);
  });
});

console.log("server listening 3000");
console.clear();
