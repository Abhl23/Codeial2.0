{
  // display notifications using Noty
  let showNotification = function (type, message) {
    new Noty({
      type: type,
      text: message,
      theme: "relax",
      layout: "topRight",
      timeout: 1500,
    }).show();
  };

  $("#preview-image").hide();

  $('input[type="file"]').change(function (event) {
    $("#preview-image").hide();

    const file = this.files[0]; // can use event.target OR this to get the target element
    // console.log(file);
    if (file) {
      let reader = new FileReader();
      reader.onload = function (event) {
        // gets fired when the reader is successfully loaded
        // console.log(this.result);
        $("#preview-image").attr("src", event.target.result).show();
      };
      reader.readAsDataURL(file); // converts the file into data:URL(encoded string) after upload
    } // and stores the data:URL into result attribute of input
  });

  let toggleFriendship = () => {
    let toggleButton = $("#toggle-friendship");

    toggleButton.click(function (event) {
      $.ajax({
        method: "get",
        url: toggleButton.attr("data-url"),
        success: function (data) {
          if (data.data.friendshipExists) {
            toggleButton.text("Remove Friend");
          } else {
            toggleButton.text("Add Friend");
          }

          showNotification("success", data.message);
        },
        error: function (error) {
          console.log(error.responseText);
          showNotification("error", error.responseJSON.message);
        },
      });
    });
  };

  toggleFriendship();
}
