const addMessage = (domID, message) => {
  //TODO set the title, message, author
  document.getElementById(domID).innerHTML += `<li>${message}</li>`;
}

const setEventListener = (domID, eventType, cb) => {
  document.getElementById(domID).addEventListener(eventType, (event) => {
    event.preventDefault();
    cb();
  })
}

const getValueById = (domID) => document.getElementById(domID).value;
