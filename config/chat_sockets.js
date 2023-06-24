module.exports.chatSockets = function (socketServer) {
  const io = require("socket.io")(socketServer, {
    cors: {
        origin: "http://localhost:8000"
    }
  });

  io.sockets.on("connection", function (socket) {
    console.log("New connection received!", socket.id);

    socket.on("disconnect", function () {
      console.log("Socket disconnected!");
    });
  });
};
