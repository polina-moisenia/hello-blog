const socket = io('http://localhost:5000')
var counter = 0;

socket.on('messageToClient', (posts) => {
  var initialPosts = JSON.parse(posts);
  counter = initialPosts.number;
  initialPosts.forEach(post => {
    addPost('posts', post)
  });

  socket.emit('messageToServer', 'Web sockets are ready on client side')
})

setEventListener('post-created-form', 'edit', () => {
  var postUpdated = {
    title : getValueById('title'),
    summary : getValueById('summary')
  };
  socket.emit('postUpdatedOnClient', JSON.stringify(postUpdated))
})

setEventListener('message-form', 'submit', () => {
  var postCreated = {
         title : getValueById('title'),
         summary : getValueById('summary')
       };
  socket.emit('newPostCreatedOnClient', JSON.stringify(postCreated))
})

socket.on('newPostCreatedOnApi', (newPost) => {
  counter = counter + 1;
  newPost.number = counter;
  addPost('posts', newPost)
})

socket.on('postUpdatedOnApi', (postUpdated) => {
  addPost('posts', newPost)
})