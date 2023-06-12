{
  // 

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

          deletePost($(' .delete-post-button', newPost));
        },
        error: function (error) {
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
  let deletePost=function(deleteLink){
    deleteLink.click(function(event){
      event.preventDefault();

      $.ajax({
        method: 'get',
        url: deleteLink.attr('href'),
        success: function(data){
          $(`#post-${data.data.post_id}`).remove();
        },
        error: function(error){
          console.log(error.responseText);
        }
      });
    });
  };

  // attaching click event on every delete post link
  // let deletePostButtons=$('.delete-post-button');
  // for(let i=0; i<deletePostButtons.length; i++){
  //   deletePost(deletePostButtons[i]);
  // }


  createPost();
}
