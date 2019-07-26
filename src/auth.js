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
    {rule: 'VIEW_POSTS', field: process.env.AUTH_FIELD, match: process.env.AUTH_VIEW_MATCH}, 
    {rule: 'ADD_POSTS', field: process.env.AUTH_FIELD, match: process.env.AUTH_ADD_MATCH},
    {rule: 'DELETE_POSTS', field: process.env.AUTH_FIELD, match: process.env.AUTH_DELETE_MATCH},

    {rule: 'VIEW_COMMENTS', field: process.env.AUTH_FIELD, match: process.env.AUTH_VIEW_MATCH}, 
    {rule: 'ADD_COMMENTS', field: process.env.AUTH_FIELD, match: process.env.AUTH_ADD_MATCH},
    {rule: 'DELETE_COMMENTS', field: process.env.AUTH_FIELD, match: process.env.AUTH_DELETE_MATCH},

    {rule: 'VIEW_USERS', field: process.env.AUTH_FIELD, match: process.env.AUTH_VIEW_MATCH}, 
    {rule: 'ADD_USERS', field: process.env.AUTH_FIELD, match: process.env.AUTH_ADD_MATCH},
    {rule: 'DELETE_USERS', field: process.env.AUTH_FIELD, match: process.env.AUTH_DELETE_MATCH}
];

const auth = new Auth(authPermisions);
module.exports = auth;