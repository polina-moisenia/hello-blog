const fs = require('fs');
const usersToCheck = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

const printUsers = function(users){
    users.forEach(user => console.log(`Name - ${user.name}, Email - ${user.login}`));
}

console.log('Curent blog users :');
printUsers(usersToCheck);

//Implementation
class Auth {
    constructor(permisions) {
        this.permisions = permisions;
    }

    canUser(rule, user){
        const [ ruleFound ] = this.permisions.filter(
            permision => permision.rule === rule &&
            user[permision.field].match(permision.match));
        return ruleFound;
    }
}

const authPermisions = [
    {rule: 'VIEW_POSTS', field: process.env.AUTH_VIEW_PHOTOS_FIELD, match: process.env.AUTH_VIEW_PHOTOS_MATCH}, 
    {rule: 'ADD_POSTS', field: process.env.AUTH_ADD_POSTS_FIELD, match: process.env.AUTH_ADD_POSTS_MATCH},
    {rule: 'DELETE_POSTS', field: process.env.AUTH_DELETE_POSTS_FIELD, match: process.env.AUTH_DELETE_POSTS_MATCH}
];

//Export as module later
const auth = new Auth(authPermisions);

//TODO add login/logout endpoints

//TODO move checks to unit tests
const usersView = [];
const usersAdd = [];
const usersDelete = [];

for (i = 0; i < usersToCheck.length; i++) { 
    const user = usersToCheck[i];
    if(auth.canUser('VIEW_POSTS', user)){
        usersView.push(user);
    }

    if(auth.canUser('ADD_POSTS', user)){
        usersAdd.push(user);
    }

    if(auth.canUser('DELETE_POSTS', user)){
        usersDelete.push(user);
    }
}

console.log('Users that can view posts :');
printUsers(usersView);

console.log('Users that can add posts :');
printUsers(usersAdd);

console.log('Users that can delete posts :');
printUsers(usersDelete);