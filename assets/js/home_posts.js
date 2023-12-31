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

  // method to submit the form data for new post using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (event) {
      event.preventDefault();

      $.ajax({
        method: "post",
        url: "/posts/create",
        data: newPostForm.serialize(), // converts the form data into JSON
        success: function (data) {
          let newPost = newPostDom(data.data.post);

          $("#posts-list-container > ul").prepend(newPost);

          deletePost($(" .delete-post-button", newPost));   // attaching click event to delete link of new post

          homeLikes.toggleLikeFunctionality($(" .like-button", newPost)); // attaching click event to like button of new post

          showNotification('success', data.message);

          $("#new-post-form textarea").val("");
        },
        error: function (error) {
          showNotification('error', error.responseJSON.message);
          console.log(error.responseText);
        },
      });
    });
  };

  // method to create a post in DOM
  let newPostDom = function (post) {
    return $(`<li id="post-${post._id}">
                <p>
                    <small>
                        <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                    </small>
                    ${post.content}
                    <br />
                    <strong>${post.user.name}</strong>
                    &ensp;
                    <a class="like-button" href="/likes/toggle/?id=${post._id}&type=Post">
                      <span class="likes-count">${post.likes.length}</span> likes
                    </a>  
                </p>
            
                <div class="post-comments-container">
                    <form action="/comments/create" method="post">
                        <input type="text" name="content" placeholder="Add a comment..." required />
                        <input type="hidden" name="post" value="${post._id}" />
                        <button type="submit">Add Comment</button>
                    </form>
                
                    <div class="post-comments-list">
                        <ul id="post-comments-${post._id}">
                        
                        </ul>
                    </div>
                </div>
            </li>`);
  };

  // method to delete a post from DOM
  let deletePost = function (deleteLink) {
    deleteLink.click(function (event) {
      event.preventDefault();

      $.ajax({
        method: "get",
        url: deleteLink.attr("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();

          showNotification('success', data.message);
        },
        error: function (error) {
          showNotification('error', error.responseJSON.message);
          console.log(error.responseText);
        },
      });
    });
  };

  // attaching click event on every delete post link
  let deletePostButtons = $(".delete-post-button");
  for (let i = 0; i < deletePostButtons.length; i++) {
    deletePost(deletePostButtons.eq(i)); // eq() used because we want to pass a JQuery object
  }

  createPost();
}
