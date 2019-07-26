const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const usersDataLocation = path.join(__dirname, '../data/users.json');
const usersCollection = JSON.parse(fs.readFileSync(usersDataLocation, 'utf8'));

const getUsers = function (req, res) {
  res.json(usersCollection.map(({password, ...user}) => user));
}

const getUserById = function (req, res) {
  const [user] = usersCollection.filter(user => user.userId === req.params.id).map(({password, ...user}) => user);
  user ? res.json(user) : res.status(404).send('User was not found');
};

const updateUser = function (req, res) {
  const userUpdated = req.body;
  //TODO rewrite validation
  if (!userUpdated || !userUpdated.name || !userUpdated.login || !userUpdated.password) res.status(400).send('Bad request');

  //TODO how users will be created, loaded?
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
}

const deleteUser = function (req, res) {
  const index = usersCollection.findIndex(user => user.userId === req.params.id);
  if (index === -1) {
    res.status(404).send('User was not found');
  } else {
    usersCollection.splice(index, 1);
    fs.writeFileSync(usersDataLocation, JSON.stringify(usersCollection));
    res.status(200).send('User was deleted');
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
}
