const socket = io('http://localhost:5000')

socket.on('messageToClient', (msg) => {
  console.log(msg)
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
  console.log(newPost)
  addMessage('posts', newPost)
})