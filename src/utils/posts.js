const fs = require('fs');
const uuid = require('uuid');
const { postsDataLocation } = require('../config.js');
const postsCollection = JSON.parse(fs.readFileSync(postsDataLocation, 'utf8'));

class Posts {
    getAllPostsFromCollection () {
        return postsCollection;
    }
    
    getPostFromCollectionById (id) {
        return postsCollection.find(post => post.postId === id);
    }
    
    createPostInCollection (post) {
        post.postId = uuid.v4();
        post.createdAt = new Date().toISOString();
        postsCollection.push(post);
        fs.writeFileSync(postsDataLocation, JSON.stringify(postsCollection));
        return post;
    }
    
    updatePostInCollection (id, post) {
        const index = postsCollection.findIndex(post => post.postId === id);
        if (index === -1) {
            return null;
        } else {
            postFound = postsCollection[index];
            postFound.title = post.title;
            postFound.summary = post.summary;
    
            postsCollection[index] = postFound;
            fs.writeFileSync(postsDataLocation, JSON.stringify(postsCollection));
            return post;
        }
    }
    
    deletePostFromCollection (id) {
        const index = postsCollection.findIndex(post => post.postId === id);
        if (index === -1) {
            return false;
        } else {
            postsCollection.splice(index, 1);
            fs.writeFileSync(postsDataLocation, JSON.stringify(postsCollection));
            return true;
        }
    }
}

const posts = new Posts();
module.exports = posts;