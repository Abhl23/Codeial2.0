// this class will send the request for connection
class ChatEngine {
  constructor(chatBoxId, userEmail) {
    this.chatBox = $(`#${chatBoxId}`);
    this.userEmail = userEmail;

    this.socket = io.connect("http://54.82.88.26:5000", {
      transports: ["websocket", "polling", "flashsocket"],
    });

    if (this.userEmail) {
      this.connectionHandler();
    }
  }

  connectionHandler() {
    let self = this;

    this.socket.on("connect", function () {
      console.log("Connection establised using sockets...!");

      self.socket.emit("join_room", {
        user_email: self.userEmail,
        chatroom: "codeial",
      });

      self.socket.on("user_joined", function (data) {
        console.log("A user joined", data);
      });
    });

    // send a message on clicking the send button
    $("#send-message").on("click", function (event) {
      let msg = $("#message-input").val();
      
      if(msg){
        self.socket.emit("send_message", {
          message: msg,
          user_email: self.userEmail,
          chatroom: "codeial"
        });
      }
    });

    this.socket.on("receive_message", function(data){
      console.log("Message received!", data.message);

      let newMessage=$("<li></li>");
      let messageType;

      if(data.user_email == self.userEmail)
        messageType="self-message";
      else
        messageType="other-message";

      newMessage.addClass(messageType);

      newMessage.append($("<span></span>").text(data.message));

      newMessage.append($("<sub></sub>").text(data.user_email));

      let messagesList=$("#messages-list");
      messagesList.append(newMessage);

      // to auto scroll to the new message
      let position=newMessage.offset().top - messagesList.offset().top + messagesList.scrollTop();
      messagesList.animate({
        scrollTop: position
      });
    });
  }
}
