const httpStatus = require('http-status');
const User = require('../models/User.js');
const { getGravatarProfile } = require('../utils/gravatar-loader.js');

const getUsers = function (req, res, next) {
  User.find({}, (err, docs) => {
    if (err) return next(err);
    return res.json(docs);
  }).select('-_id -password');
}

const getUserById = async function (req, res, next) {
  try {
    const doc = await User.findOne({ userId: req.params.id }, function (err, doc) {
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
    return next(err);
  }
};

const updateUser = function (req, res, next) {
  const userUpdated = req.body;
  User.findOne({ userId: req.params.id }, function (err, doc) {
    if (err) return next(err);
    if (!doc) return res.status(httpStatus.NOT_FOUND).send('User was not found');

    doc.name = userUpdated.name;
    doc.login = userUpdated.login;
    doc.setPassword(userUpdated.password);
    doc.save();

    return res.status(httpStatus.OK).send(`User ${doc.userId} was updated`);
  });
}

const deleteUser = function (req, res, next) {
  User.findOneAndRemove({ userId: req.params.id }, function (err, doc) {
    if (err) return next(err);
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