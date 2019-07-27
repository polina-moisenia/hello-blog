const path = require('path');

module.exports ={
    postsDataLocation :  path.join(__dirname, '../data/posts.json'),
    commentsDataLocation : path.join(__dirname, '../data/comments.json'),
    usersDataLocation : path.join(__dirname, '../data/users.json')
}