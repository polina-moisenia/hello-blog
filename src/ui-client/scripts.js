const socket = io('http://localhost:5000')

socket.on('messageToClient', (posts) => {
  var initialPosts = JSON.parse(posts);
  counter = initialPosts.number;
  initialPosts.forEach(post => { addPost('posts', post); });
  socket.emit('messageToServer', 'Web sockets are ready on client side')
});

setEventListener('message-form', 'submit', () => {
  var postCreated = {
    authorEmail: getValueById('email'),
    title: getValueById('title'),
    summary: getValueById('summary')
  };
  socket.emit('newPostCreatedOnClient', JSON.stringify(postCreated))
});

socket.on('newPostCreatedOnApi', (newPost) => {
  addPost('posts', newPost)
});