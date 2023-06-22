// making toggleLikeFunctionality function available to other javascript files
let homeLikes = (function () {
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

  let toggleLikeFunctionality = (toggleLink) => {
    toggleLink.click(function (event) {
      event.preventDefault();

      $.ajax({
        method: "get",
        url: toggleLink.attr("href"),
        success: function (data) {
          let likesCount = $(" .likes-count", toggleLink);

          if (data.data.deleted) {
            likesCount.text(likesCount.text() - 1);
          } else {
            likesCount.text(parseInt(likesCount.text()) + 1);
          }

          showNotification("success", data.message);
        },
        error: function (data) {
          showNotification("error", error.responseJSON.message);
          console.log(error.responseText);
        },
      });
    });
  };

  let likeButtons = $(".like-button");
  for (let i = 0; i < likeButtons.length; i++) {
    toggleLikeFunctionality(likeButtons.eq(i));
  }

  return {
    toggleLikeFunctionality: toggleLikeFunctionality,
  };
})();
