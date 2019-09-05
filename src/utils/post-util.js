const fs = require('fs');
const uuid = require('uuid');

const { postsDataLocation } = require('../config.js');
const postsCollection = JSON.parse(fs.readFileSync(postsDataLocation, 'utf8'));

const createPostInCollection = function (post) {
    post.postId = uuid.v4();
    post.createdAt = new Date().toISOString();
    postsCollection.push(post);
    fs.writeFileSync(postsDataLocation, JSON.stringify(postsCollection)); 
    
    return post;
};

module.exports = {
    createPostInCollection
}