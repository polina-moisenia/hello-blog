const fs = require('fs');
const uuid = require('uuid');
const httpStatus = require('http-status');
const { commentsDataLocation } = require('../config.js');
const commentsCollection = JSON.parse(fs.readFileSync(commentsDataLocation, 'utf8'));

const getCommentsByPostId = function (req, res) {
  res.json(commentsCollection.filter(comment => comment.postId == req.postId));
};

const createComment = function (req, res) {
  const comment = req.body;
  //TODO rewrite validation
  if (!comment || !comment.summary || !comment.authorId) res.status(httpStatus.BAD_REQUEST).send('Bad request');

  comment.postId = req.postId;
  comment.commentId = uuid.v4();
  comment.createdAt = new Date().toISOString();

  commentsCollection.push(comment);
  fs.writeFileSync(commentsDataLocation, JSON.stringify(commentsCollection));
  res.status(httpStatus.CREATED).send(`Comment was created, id = ${comment.commentId}`);
};

const getCommentById = function (req, res) {
  const [comment] = commentsCollection.filter(comment => comment.postId === req.postId && comment.commentId === req.params.id);
  comment ? res.json(comment) : res.status(httpStatus.NOT_FOUND).send('Comment was not found');
};

const updateComment = function (req, res) {
  const commentUpdated = req.body;
  //TODO rewrite validation
  if (!commentUpdated || !commentUpdated.summary) res.status(httpStatus.BAD_REQUEST).send('Bad request');

  const index = commentsCollection.findIndex(comment => comment.postId === req.postId && comment.commentId === req.params.id);
  if (index === -1) {
    res.status(httpStatus.NOT_FOUND).send('Comment was not found');
  } else {
    //TODO add modified field to the schema if needed
    commentFound = commentsCollection[index];
    commentFound.summary = commentUpdated.summary;

    commentsCollection[index] = commentFound;
    fs.writeFileSync(commentsDataLocation, JSON.stringify(commentsCollection));
    res.status(httpStatus.OK).send(`Comment ${commentFound.commentId} was updated`);
  }
};

const deteleComment = function (req, res) {
  const index = commentsCollection.findIndex(comment => comment.postId === req.postId && comment.commentId === req.params.id);
  if (index === -1) {
    res.status(httpStatus.NOT_FOUND).send('Comment was not found');
  } else {
    commentsCollection.splice(index, 1);
    fs.writeFileSync(commentsDataLocation, JSON.stringify(commentsCollection));
    res.status(httpStatus.OK).send('Comment was deleted');
  }
};

module.exports = {
  getCommentsByPostId,
  createComment,
  getCommentById,
  updateComment,
  deteleComment
};