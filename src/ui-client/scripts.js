const socket = io('http://localhost:5000')
var counter = 0;

socket.on('messageToClient', (msg) => {
  console.log(msg);
  counter = 0;
  socket.emit('messageToServer', 'Web sockets are ready on client side')
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