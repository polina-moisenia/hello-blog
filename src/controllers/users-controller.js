const fs = require('fs');
const httpStatus = require('http-status');
const crypto = require('crypto');
const User = require('../models/User.js');
const { usersDataLocation, saltRounds, hashAlg } = require('../config.js');
const { getGravatarProfile } = require('../utils/gravatar-loader.js');
const usersCollection = JSON.parse(fs.readFileSync(usersDataLocation, 'utf8'));

const getUsers = function (req, res) {
  res.json(usersCollection.map(({ password, ...user }) => user));
}

const getUserById = async function (req, res) {
  const user = await User.findOne({ userId: req.params.id }, function (err, user) {
    if (err) return console.log(err);
    return user;
  });

  //({ password, _id, ...userFound }) => userFound
  console.log(user);
  //TODO handle promise
  //.catch(error => console.log(error.stack))
  
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
    userFound.password = crypto.pbkdf2Sync(userUpdated.password, saltRounds, 1000, 64, hashAlg).toString(`hex`);

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