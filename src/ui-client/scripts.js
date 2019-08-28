const socket = io('http://localhost:5000')

// setEventListener('message-form', 'submit', () => {
//   var postCreated = {
//     title : getValueById('title'),
//     message : getValueById('message')
//   };
//   //TODO get from cookies
//   //postCreated['authorEmail'] = getValueById('authorEmail');
//   socket.emit('newPostCreated', JSON.stringify(postCreated));
// })

socket.on('messageToClient', (msg) => {
  console.log(msg)
  socket.emit('messageToServer', 'hello from client')
})

setEventListener('message-form', 'submit', () => {
  socket.emit('newMessageFromClient', {text: getValueById('message')})
})

socket.on('newMessageToClient', ({text}) => {
  console.log(text)
  addMessage('posts', text)
})