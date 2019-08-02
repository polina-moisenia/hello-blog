const path = require('path');

module.exports ={
    postsDataLocation :  path.join(__dirname, '../data/posts.json'),
    commentsDataLocation : path.join(__dirname, '../data/comments.json'),
    usersDB : "mongodb+srv://admin:admin@blog-cluster-tfscs.mongodb.net/blog",
    saltRounds : '12',
    hashAlg : `sha512`,
    cookieName : 'logged-in'
}