const express = require('express');
const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const { authorizeByCookie } = require('./cookie-handler.js');

const commentsDataLocation = path.join(__dirname, '../data/comments.json');
const commentsCollection = JSON.parse(fs.readFileSync(commentsDataLocation, 'utf8'));

const commentsRouter = express.Router();

commentsRouter.get('/', function (req, res, next) { authorizeByCookie('VIEW_COMMENTS', req, res, next) }, function (req, res) {
  res.json(commentsCollection.filter(comment => comment.postId == req.postId));
});

commentsRouter.post('/', function (req, res, next) { authorizeByCookie('ADD_COMMENTS', req, res, next) }, function (req, res) {
  //TODO validate body, check if post and author exist?
  const comment = req.body;
  if (!comment) res.status(400).send('Bad request');

  comment.commentId = uuid.v4();
  //TODO check date format
  comment.createdAt = (new Date()).toUTCString();

  commentsCollection.push(comment);
  fs.writeFileSync(commentsDataLocation, JSON.stringify(commentsCollection));
  res.status(201).send(`Comment was created, id = ${comment.commentId}`);
});

commentsRouter.get('/:id', function (req, res, next) { authorizeByCookie('VIEW_COMMENTS', req, res, next) }, function (req, res) {
  const [comment] = commentsCollection.filter(comment => comment.postId === req.postId && comment.commentId === req.params.id);
  comment ? res.json(comment) : res.status(404).send('Comment was not found');
});

commentsRouter.put('/:id', function (req, res, next) { authorizeByCookie('ADD_COMMENTS', req, res, next) }, function (req, res) {
  //TODO understand what woud be the diff between post by id - can I create comment here?
  //TODO validate body, check if post and author exist?
  const commentUpdated = req.body;
  if (!commentUpdated) res.status(400).send('Bad request');

  const index = commentsCollection.findIndex(comment => comment.postId === req.postId && comment.commentId === req.params.id);
  if (index === -1) {
    res.status(404).send('Comment was not found');
  } else {    
    //TODO add modified field to the schema if needed
    commentFound = commentsCollection[index];
    commentFound.summary = commentUpdated.summary;

    commentsCollection[index] = commentFound;
    fs.writeFileSync(commentsDataLocation, JSON.stringify(commentsCollection));
    res.status(200).send(`Comment ${commentFound.commentId} was updated`);
  }
});

commentsRouter.delete('/:id', function (req, res, next) { authorizeByCookie('DELETE_COMMENTS', req, res, next) }, function (req, res) {
  const index = commentsCollection.findIndex(comment => comment.postId === req.postId && comment.commentId === req.params.id);
  if (index === -1) {
    res.status(404).send('Comment was not found');
  } else {
    commentsCollection.splice(index, 1);
    fs.writeFileSync(commentsDataLocation, JSON.stringify(commentsCollection));
    res.status(200).send('Comment was deleted');
  }
});

module.exports = commentsRouter;