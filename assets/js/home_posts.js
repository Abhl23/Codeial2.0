{
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
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // method to create a post in DOM
  let newPostDom = function (post) {
    return $(`<li id="post-${post.id}">
                <p>
                    <small>
                        <a href="/posts/destroy/${post._id}">X</a>
                    </small>
                    ${post.content}
                    <br />
                    <strong>${post.user.name}</strong>
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

  createPost();
}
