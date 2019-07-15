const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { authorizeByCookie } = require('./cookie-handler.js');
const saltRounds = 10;

const usersDataLocation = path.join(__dirname, '../data/users.json');
const usersCollection = JSON.parse(fs.readFileSync(usersDataLocation, 'utf8'));

const usersRouter = express.Router();

usersRouter.get('/', function (req, res, next) { authorizeByCookie('VIEW_USERS', req, res, next) }, function (req, res) {
  //TODO hide password hashes
  res.json(usersCollection);
});

usersRouter.get('/:id', function (req, res, next) { authorizeByCookie('VIEW_USERS', req, res, next) }, function (req, res) {
  const [user] = usersCollection.filter(user => user.userId === req.params.id);
  //TODO hide password hash
  user ? res.json(user) : res.status(404).send('User was not found');
});

usersRouter.put('/:id', function (req, res, next) { authorizeByCookie('ADD_USERS', req, res, next) }, function (req, res) {
  const userUpdated = req.body;
  //TODO validate body (no id inside it, only in url + password as a string)
  if (!userUpdated) res.status(400).send('Bad request');

  //TODO can I create user here?
  const index = usersCollection.findIndex(user => user.userId === req.params.id);
  if (index === -1) {
    res.status(404).send('User was not found');
  } else {
    userFound = usersCollection[index];
    userFound.name = userUpdated.name;
    userFound.login = userUpdated.login;
    userFound.password = bcrypt.hashSync(userUpdated.password, saltRounds);

    usersCollection[index] = userFound;
    fs.writeFileSync(usersDataLocation, JSON.stringify(usersCollection));

    res.status(200).send(`User ${userFound.userId} was updated`);
  }
});

usersRouter.delete('/:id', function (req, res, next) { authorizeByCookie('DELETE_USERS', req, res, next) }, function (req, res) {
  const index = usersCollection.findIndex(user => user.userId === req.params.id);
  if (index === -1) {
    res.status(404).send('User was not found');
  } else {
    usersCollection.splice(index, 1);
    fs.writeFileSync(usersDataLocation, JSON.stringify(usersCollection));
    res.status(200).send('User was deleted');
  }
});

module.exports = usersRouter;