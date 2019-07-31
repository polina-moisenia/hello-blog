const fs = require('fs');
const uuid = require('uuid');
const httpStatus = require('http-status');
const { postsDataLocation } = require('../config.js');
const postsCollection = JSON.parse(fs.readFileSync(postsDataLocation, 'utf8'));

const getPosts = function (req, res) {
  res.json(postsCollection);
};

const createPost = function (req, res) {
  const post = req.body;
  //TODO rewrite validation
  if (!post || !post.authorId || !post.title || !post.summary) res.status(httpStatus.BAD_REQUEST).send('Bad request');

  post.postId = uuid.v4();
  post.createdAt = new Date().toISOString();

  postsCollection.push(post);
  fs.writeFileSync(postsDataLocation, JSON.stringify(postsCollection));
  res.status(httpStatus.CREATED).send(`Post was created, id = ${post.postId}`);
};

const getPostById = function (req, res) {
  const post = postsCollection.find(post => post.postId === req.params.id);
  post ? res.json(post) : res.status(httpStatus.NOT_FOUND).send('Post was not found');
};

const updatePost = function (req, res) {
  const postUpdated = req.body;
  //TODO rewrite validation  
  if (!postUpdated || !post.title || !post.summary) res.status(httpStatus.BAD_REQUEST).send('Bad request');

  const index = postsCollection.findIndex(post => post.postId === req.params.id);
  if (index === -1) {
    res.status(httpStatus.NOT_FOUND).send('Post was not found');
  } else {
    //TODO add modified field to the schema if needed
    postFound = postsCollection[index];
    postFound.title = postUpdated.title;
    postFound.summary = postUpdated.summary;

    postsCollection[index] = postFound;
    fs.writeFileSync(postsDataLocation, JSON.stringify(postsCollection));
    res.status(httpStatus.OK).send(`Post ${postFound.postId} was updated`);
  }
};

const deletePost = function (req, res) {
  const index = postsCollection.findIndex(post => post.postId === req.params.id);
  if (index === -1) {
    res.status(httpStatus.NOT_FOUND).send('Post was not found');
  } else {
    postsCollection.splice(index, 1);
    fs.writeFileSync(postsDataLocation, JSON.stringify(postsCollection));
    res.status(httpStatus.OK).send('Post was deleted');
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};