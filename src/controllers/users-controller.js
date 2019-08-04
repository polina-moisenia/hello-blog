const httpStatus = require('http-status');
const User = require('../models/User.js');
const { getGravatarProfile } = require('../utils/gravatar-loader.js');

const getUsers = function (req, res) {
  User.find({}, (err, docs) => res.json(docs)).select('-_id -password');
}

const getUserById = async function (req, res) {
  try {
    //TODO try cath looks fine?
    const doc = await User.findOne({ userId: req.params.id }, function (err, doc) {
      if (err) return console.log(err);
      return doc;
    }).select('-_id -password');

    if (doc) {
      doc.gravatarProfile = await getGravatarProfile(doc.login);
      res.json(doc);
    } else {
      res.status(httpStatus.NOT_FOUND).send('User was not found');
    }
  }
  catch (err) {
    //TODO code doublling
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(`Something broke! More info : ${err}`);
  }
};

const updateUser = function (req, res) {
  const userUpdated = req.body;
  User.findOne({ userId: req.params.id }, function (err, doc) {
    if (!doc) return res.status(httpStatus.NOT_FOUND).send('User was not found');

    doc.name = userUpdated.name;
    doc.login = userUpdated.login;
    doc.setPassword(userUpdated.password);
    doc.save();

    return res.status(httpStatus.OK).send(`User ${doc.userId} was updated`);
  });
}

const deleteUser = function (req, res) {
  User.findOneAndRemove({ userId: req.params.id }, function (err, doc) {
    if (!doc) res.status(httpStatus.NOT_FOUND).send('User was not found');
    res.status(httpStatus.OK).send('User was deleted');
  });
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
}