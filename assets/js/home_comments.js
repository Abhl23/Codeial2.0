{
  // display notifications using Noty
  let showNotifications = {
    success: function (message) {
      new Noty({
        type: "success",
        text: message,
        theme: "relax",
        layout: "topRight",
        timeout: 1500,
      }).show();
    },
    error: function (message) {
      new Noty({
        type: "error",
        text: message,
        theme: "relax",
        layout: "topRight",
        timeout: 1500,
      }).show();
    },
  };

  let createComment = function (commentForm) {
    commentForm.submit(function (event) {
      event.preventDefault();

      $.ajax({
        method: "post",
        url: "/comments/create", // will be difficult to fetch the post._id here thats why we used input type="hidden" to send the post._id in the new comment form
        data: commentForm.serialize(),
        success: function (data) {
          let newComment = newCommentDOM(data.data.comment);

          $(`#post-comments-${data.data.comment.post}`).prepend(newComment);

          showNotifications.success(data.message);

          $(' input[type="text"]', commentForm).val("");
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  let newCommentDOM = function (comment) {
    return $(`<li id="comment-${comment._id}">
                    <p>
                        <small>
                            <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                        </small>
                        
                        ${comment.content}
                        <br />
                        <small>${comment.user.name}</small>
                    </p>
                </li>`);
  };

  // attaching submit event to every new comment form
  let newCommentForms = $(".new-comment-form");
  for (let i = 0; i < newCommentForms.length; i++) {
    createComment(newCommentForms.eq(i));
  }
}
