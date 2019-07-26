const fs = require('fs');
const auth = require('../src/auth.js');

const usersToCheck = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

const printUsers = function(users) {
    users.forEach(user => console.log(`Name - ${user.name}, Email - ${user.login}`));
}

console.log('Curent blog users :');
printUsers(usersToCheck);

const usersFilteredByRules = usersToCheck.reduce((result, user) => {
    if(auth.canUser('VIEW_POSTS', user)){
        result.usersView.push(user);
    }

    if(auth.canUser('ADD_POSTS', user)){
        result.usersAdd.push(user);
    }

    if(auth.canUser('DELETE_POSTS', user)){
        result.usersDelete.push(user);
    }

    return result;
}, { usersView: [], usersAdd: [], usersDelete: [] });

//TODO change for assert
console.log('Users that can view posts :');
printUsers(usersFilteredByRules.usersView);

console.log('Users that can add posts :');
printUsers(usersFilteredByRules.usersAdd);

console.log('Users that can delete posts :');
printUsers(usersFilteredByRules.usersDelete);