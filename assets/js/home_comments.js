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

  let createComment = function (commentForm) {
    commentForm.submit(function (event) {
      // commentForm is accessible in this handler function because of CLOSURES
      event.preventDefault();

      $.ajax({
        method: "post",
        url: "/comments/create", // will be difficult to fetch the post._id here thats why we used input type="hidden" to send the post._id in the new comment form
        data: commentForm.serialize(),
        success: function (data) {
          let newComment = newCommentDOM(data.data.comment);

          $(`#post-comments-${data.data.comment.post}`).append(newComment);

          deleteComment($(" .delete-comment-button", newComment)); // attaching click event to delete link of new comment

          showNotification("success", data.message);

          $(' input[type="text"]', commentForm).val("");
        },
        error: function (error) {
          showNotification('error', error.responseJSON.message);
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

  let deleteComment = function (deleteLink) {
    deleteLink.click(function (event) {
      event.preventDefault();

      $.ajax({
        method: "get",
        url: deleteLink.attr("href"),
        success: function (data) {
          $(`#comment-${data.data.comment_id}`).remove();

          showNotification("success", data.message);
        },
        error: function (error) {
          showNotification('error', error.responseJSON.message);
          console.log(error.responseText);
        },
      });
    });
  };

  // attaching click event to every delete comment link
  let deleteCommentButtons = $(".delete-comment-button");
  for (let i = 0; i < deleteCommentButtons.length; i++) {
    deleteComment(deleteCommentButtons.eq(i));
  }

  // attaching submit event to every new comment form
  let newCommentForms = $(".new-comment-form");
  for (let i = 0; i < newCommentForms.length; i++) {
    createComment(newCommentForms.eq(i));
  }
}
