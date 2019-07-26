const fs = require('fs');
const path = require('path');
const uuid = require('uuid');

const commentsDataLocation = path.join(__dirname, '../data/comments.json');
const commentsCollection = JSON.parse(fs.readFileSync(commentsDataLocation, 'utf8'));

const getCommentsByPostId = function (req, res) {
  res.json(commentsCollection.filter(comment => comment.postId == req.postId));
};

const createComment = function (req, res) {
  const comment = req.body;
  //TODO rewrite validation
  if (!comment || !comment.summary || !comment.authorId) res.status(400).send('Bad request');

  comment.postId = req.postId;
  comment.commentId = uuid.v4();
  comment.createdAt = new Date().toISOString();

  commentsCollection.push(comment);
  fs.writeFileSync(commentsDataLocation, JSON.stringify(commentsCollection));
  res.status(201).send(`Comment was created, id = ${comment.commentId}`);
};

const getCommentById =  function (req, res) {
  const [comment] = commentsCollection.filter(comment => comment.postId === req.postId && comment.commentId === req.params.id);
  comment ? res.json(comment) : res.status(404).send('Comment was not found');
};

const updateComment = function (req, res) {
  const commentUpdated = req.body;
  //TODO rewrite validation
  if (!commentUpdated || !commentUpdated.summary) res.status(400).send('Bad request');

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
};

const deteleComment = function (req, res) {
  const index = commentsCollection.findIndex(comment => comment.postId === req.postId && comment.commentId === req.params.id);
  if (index === -1) {
    res.status(404).send('Comment was not found');
  } else {
    commentsCollection.splice(index, 1);
    fs.writeFileSync(commentsDataLocation, JSON.stringify(commentsCollection));
    res.status(200).send('Comment was deleted');
  }
};

module.exports = {
  getCommentsByPostId,
  createComment,
  getCommentById,
  updateComment,
  deteleComment
};