const io = require("socket.io")(3000);

io.on("connection", socket => {
  /**
   * Eventos para manipular o DOM
   */
  // Emite a todos usuários, um array com todos sockets conectados
  io.emit("users", Object.keys(io.sockets.sockets));
  socket.on("disconnect", () => io.emit("users", Object.keys(io.sockets.sockets)));
  // Emite para salvar o ID de quem conectou
  socket.emit("my-id", socket.id);
  /**/

  socket.on("data-channel offer", (data) => {
    socket.to(data.receiver).emit("data-channel offer", data);
  });
  socket.on("data-channel answer", (data) => {
    socket.to(data.caller).emit("data-channel answer", data);
  });

  socket.on("new-ice-candidate", (data) => {
    socket.to(data.receiver).emit('new-ice-candidate', data);
  });

  socket.on('data-channel connected', (data) => {
    socket.to(data.receiver).emit('data-channel connected', data);
  })
});

console.log("server listening 3000");
console.clear();
