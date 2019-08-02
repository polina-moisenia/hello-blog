const crypto = require('crypto');
const httpStatus = require('http-status');
const { saltRounds, hashAlg, cookieName } = require('../config.js');
const User = require('../models/User.js');

//Login
const setCookie = function (req, res) {
    const cookie = req.cookies[cookieName];
    if (cookie) {
        res.status(httpStatus.PERMANENT_REDIRECT).redirect('/posts');
    } else {
        const login = req.body.login;
        const password = req.body.password;
        if (!login || !password) {
            res.status(httpStatus.BAD_REQUEST).send('Login and password requiried');
        }

        User.findOne({ login: login }, function (err, doc) {
            if (!doc) {
                res.status(httpStatus.UNAUTHORIZED).send('Wrong user, try /login again');
            } else if (!checkPasswordForUser(doc, password)) {
                res.status(httpStatus.UNAUTHORIZED).send('Wrong password, try /login again');
            } else {
                res.cookie(cookieName, login);
                res.status(httpStatus.PERMANENT_REDIRECT).redirect('/posts');
            }
        });

    }
};

const checkPasswordForUser = function (user, password) {
    return user.password === crypto.pbkdf2Sync(password, saltRounds, 1000, 64, hashAlg).toString(`hex`);
}

//Logout
const deleteCookie = function (req, res) {
    const cookie = req.cookies[cookieName];
    if (cookie) {
        res.clearCookie(cookieName);
        res.status(httpStatus.OK).send('Logged out');
    } else {
        res.status(httpStatus.FORBIDDEN).send('Already logged out');
    }
};

module.exports = {
    setCookie,
    deleteCookie
};