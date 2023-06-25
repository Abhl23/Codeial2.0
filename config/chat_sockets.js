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

    // detecting a join_room event emitted by the client
    socket.on("join_room", function(data){
      console.log("Joining request received", data);

      // joining the user to this particular chatroom
      socket.join(data.chatroom);

      // emitting an event called user_joined to all the users in this particular chatroom
      io.in(data.chatroom).emit("user_joined", data);
    });

    // detect send_message and broadcast the message to everyone in the chatroom
    socket.on("send_message", function(data){
      io.in(data.chatroom).emit("receive_message", data);
    });
  });
};
