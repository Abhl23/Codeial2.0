// this class will send the request for connection
class ChatEngine {
  constructor(chatBoxId, userEmail) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;

    this.socket = io.connect("http://localhost:5000", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    if (this.userEmail) {
      this.connectionHandler();
    }
  }

  connectionHandler() {
    this.socket.on("connect", function () {
      console.log("Connection establised using sockets...!");
    });
  }
}
