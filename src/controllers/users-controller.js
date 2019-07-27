const fs = require('fs');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const { usersDataLocation } = require('../config.js');
const { getGravatarProfile } = require('../utils/gravatar-loader.js');
const saltRounds = 10;
const usersCollection = JSON.parse(fs.readFileSync(usersDataLocation, 'utf8'));

const getUsers = function (req, res) {
  res.json(usersCollection.map(({ password, ...user }) => user));
}

const getUserById = async function (req, res) {
  const [user] = usersCollection.filter(user => user.userId === req.params.id).map(({ password, ...user }) => user);
  if (user) {
    user.gravatarProfile = await getGravatarProfile(user.login);
    res.json(user);
  } else {
    res.status(httpStatus.NOT_FOUND).send('User was not found');
  }
};

const updateUser = function (req, res) {
  const userUpdated = req.body;
  //TODO rewrite validation
  if (!userUpdated || !userUpdated.name || !userUpdated.login || !userUpdated.password) res.status(httpStatus.BAD_REQUEST).send('Bad request');

  //TODO how users will be created, loaded?
  const index = usersCollection.findIndex(user => user.userId === req.params.id);
  if (index === -1) {
    res.status(httpStatus.NOT_FOUND).send('User was not found');
  } else {
    userFound = usersCollection[index];
    userFound.name = userUpdated.name;
    userFound.login = userUpdated.login;
    userFound.password = bcrypt.hashSync(userUpdated.password, saltRounds);

    usersCollection[index] = userFound;
    fs.writeFileSync(usersDataLocation, JSON.stringify(usersCollection));

    res.status(httpStatus.OK).send(`User ${userFound.userId} was updated`);
  }
}

const deleteUser = function (req, res) {
  const index = usersCollection.findIndex(user => user.userId === req.params.id);
  if (index === -1) {
    res.status(httpStatus.NOT_FOUND).send('User was not found');
  } else {
    usersCollection.splice(index, 1);
    fs.writeFileSync(usersDataLocation, JSON.stringify(usersCollection));
    res.status(httpStatus.OK).send('User was deleted');
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
}