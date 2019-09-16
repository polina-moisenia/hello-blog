const addPost = (domID, post) => {
  document.getElementById(domID).innerHTML += `
  <li>
  <div class="post-repres">
    <form action="" id="post-created-form">
      <div class="col-sm-12">Post author: ${post.authorEmail}, created at ${post.createdAt}</div>
      <div class="col-sm-10">
        <input type="text" id="title-created" value="${post.title}""/>
        <textarea type="text" id="summary-created"/>${post.summary}</textarea>
      </div>
      <div class="col-sm-2">
        <input class="btn btn-primary" type="edit" value="edit"/>
        <input class="btn btn-primary" type="delete" value="delete"/>
      </div>
    </form>
  </div>
  </li>`;
}

const setEventListener = (domID, eventType, cb) => {
  document.getElementById(domID).addEventListener(eventType, (event) => {
    event.preventDefault();
    cb();
  })
}

const getValueById = (domID) => document.getElementById(domID).value;
