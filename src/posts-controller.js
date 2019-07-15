const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const statistics = require('./statistics.js');

const postsDataLocation = path.join(__dirname, '../data/posts.json');
const postsCollection = JSON.parse(fs.readFileSync(postsDataLocation, 'utf8'));

const getPosts = function (req, res) {
  res.json(postsCollection);
};

const createPost = function (req, res) {
  //TODO validate body, check if author exists?
  const post = req.body;
  if (!post) res.status(400).send('Bad request');

  post.postId = uuid.v4();
  //TODO check date format
  post.createdAt = new Date().toISOString();

  postsCollection.push(post);
  fs.writeFileSync(postsDataLocation, JSON.stringify(postsCollection));
  res.status(201).send(`Post was created, id = ${post.postId}`);
};

const getPostsStatistics = function (req, res) {
  res.send(statistics(postsCollection));
};

const getPostById = function (req, res) {
  const post = postsCollection.find(post => post.postId === req.params.id);
  post ? res.json(post) : res.status(404).send('Post was not found');
};

const updatePost = function (req, res) {
  //TODO validate body, check if author exists?
  const postUpdated = req.body;
  if (!postUpdated) res.status(400).send('Bad request');

  const index = postsCollection.findIndex(post => post.postId === req.params.id);
  if (index === -1) {
    res.status(404).send('Post was not found');
  } else {
    //TODO add modified field to the schema if needed
    postFound = postsCollection[index];
    postFound.title = postUpdated.title;
    postFound.summary = postUpdated.summary;

    postsCollection[index] = postFound;
    fs.writeFileSync(postsDataLocation, JSON.stringify(postsCollection));
    res.status(200).send(`Post ${postFound.postId} was updated`);
  }
};

const deletePost = function (req, res) {
  const index = postsCollection.findIndex(post => post.postId === req.params.id);
  if (index === -1) {
    res.status(404).send('Post was not found');
  } else {
    postsCollection.splice(index, 1);
    fs.writeFileSync(postsDataLocation, JSON.stringify(postsCollection));
    res.status(200).send('Post was deleted');
  }
};

module.exports = {
  getPosts,
  getPostsStatistics,
  getPostById,
  createPost,
  updatePost,
  deletePost
};