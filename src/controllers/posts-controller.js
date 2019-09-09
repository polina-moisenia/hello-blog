const httpStatus = require('http-status');
const { getAllPostsFromCollection, getPostFromCollectionById, createPostInCollection, updatePostInCollection, deletePostFromCollection} = require('../utils/post-util.js');

const getPosts = function (req, res) {
  res.json(getAllPostsFromCollection());
};

const createPost = function (req, res) {
  const post = req.body;
  if (!post || !post.title || !post.summary) res.status(httpStatus.BAD_REQUEST).send('Bad request');
  createPostInCollection(post);
  res.status(httpStatus.CREATED).send(`Post was created, id = ${post.postId}`);
};

const getPostById = function (req, res) {
  const post = getPostFromCollectionById(req.params.id);
  post ? res.json(post) : res.status(httpStatus.NOT_FOUND).send('Post was not found');
};

const updatePost = function (req, res) {
  const postUpdated = req.body;
  if (!postUpdated || !postUpdated.title || !postUpdated.summary) res.status(httpStatus.BAD_REQUEST).send('Bad request');
  var post = updatePostInCollection(req.params.id, postUpdated);
  if (!post) res.status(httpStatus.NOT_FOUND).send('Post was not found');
  res.status(httpStatus.OK).send(`Post ${postFound.postId} was updated`);
};

const deletePost = function (req, res) {
  const success = deletePostFromCollection(req.params.id);
  if (success) res.status(httpStatus.OK).send('Post was deleted');
  res.status(httpStatus.NOT_FOUND).send('Post was not found');
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};