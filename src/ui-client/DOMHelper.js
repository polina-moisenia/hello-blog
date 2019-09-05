const addPost = (domID, post) => {
  document.getElementById(domID).innerHTML += `
  <li>
    <form action="" id="post-created-form">
      <div>Post author: {}, id: ${post.postId}, created at ${post.createdAt}</div>
      <div class="col-sm-10">
        <input type="text" id="title-created-${post.number}" value=${post.title}"/>
        <input type="text" id="summary-created-${post.number}" value=${post.summary}/>
      </div>
      <div class="col-sm-2">
        <input class="btn btn-primary" type="edit" value="edit"/>
        <input class="btn btn-primary" type="delete" value="delete"/>
      </div>
    </form>
  </li>`;
}

const setEventListener = (domID, eventType, cb) => {
  document.getElementById(domID).addEventListener(eventType, (event) => {
    event.preventDefault();
    cb();
  })
}

const getValueById = (domID) => document.getElementById(domID).value;
