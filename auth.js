class Auth {
    constructor(permisions) {
        this.permisions = permisions
    }

    //TODO handle undefined?
    canUser(rule, user){
        const [ ruleFound ] = this.permisions.filter(permision => permision.rule === rule && user[permision.field].match(permision.match));
        return ruleFound != null;
    }
}

const authPermisions = [
    {rule: 'VIEW_POSTS', field: process.env.AUTH_VIEW_PHOTOS_FIELD, match: process.env.AUTH_VIEW_PHOTOS_MATCH}, 
    {rule: 'ADD_POSTS', field: process.env.AUTH_ADD_POSTS_FIELD, match: process.env.AUTH_ADD_POSTS_MATCH},
    {rule: 'DELETE_POSTS', field: process.env.AUTH_DELETE_POSTS_FIELD, match: process.env.AUTH_DELETE_POSTS_MATCH}
];

const auth = new Auth(authPermisions);

const fs = require('fs');
const usersToCheck = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));

const printUsers = function(users){
    users.forEach(user => console.log("Name - " + user.name + ", Email - " + user.login));
}

console.log('Curent blog users :');
printUsers(usersToCheck);

console.log('Users that can view posts :');
printUsers(usersToCheck.filter(user => auth.canUser('VIEW_POSTS', user)));

console.log('Users that can add posts :');
printUsers(usersToCheck.filter(user => auth.canUser('ADD_POSTS', user)));

console.log('Users that can delete posts :');
printUsers(usersToCheck.filter(user => auth.canUser('DELETE_POSTS', user)));