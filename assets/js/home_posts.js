
{
    let createPost = function () {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    // Clear the input field and set placeholder text
                    newPostForm.find('textarea[name="content"]').val('').attr('placeholder', user.name + ', share your thoughts...');
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    let newPostDom = function (post) {

        return $(`<div class="card mb-4" id="post-${post._id}">
    <div class="card-body">
      
      <small>
        <a class="delete-post-button" href="/posts/destroy/${post._id}">
          <i class="fa fa-trash-o" style="font-size:20px;color:red"></i>
        </a>
      </small>
     
      <h5 class="card-title">
            ${post.user.name}
                <span style="font-size : small;">
                    created a post
                </span>
      </h5>
      <p class="card-text">${post.content}</p>

      <form action="/comments/create" method="POST">
        <div class="form-group">
          <input type="text" class="form-control" name="content" placeholder="Add a comment..." required>
          <input type="hidden" name="post" value="${post._id}" required>
        </div>
        <button type="submit" class="btn btn-primary">add Comment</button>
      </form>
      <button type="button" class="btn btn-link" data-toggle="modal" data-target="#comments-modal-${post._id}">
          <i class="fa fa-comments-o" style="font-size:30px;color:red"></i>
          ${post.comments.length}
      </button>
    </div>
  </div>`)
    }


// method to delete a post from DOM
let deletePost = function(deleteLink){
    $(deleteLink).click(function(e){
        e.preventDefault();

        $.ajax({
            type: 'get',
            url: $(deleteLink).prop('href'),
            success: function(data){
                $(`#post-${data.data.post_id}`).remove();
            },error: function(error){
                console.log(error.responseText);
            }
        });

    });
}

    createPost();
}