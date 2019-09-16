const httpStatus = require('http-status');
const User = require('../models/User.js');
const cookieName = require('../config.js').cookieName;

//Login
const setCookie = function (req, res, next) {
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
            if (err) return next(err);
            if (!doc) {
                res.status(httpStatus.UNAUTHORIZED).send('Wrong user, try /login again');
            } else if (doc.validPassword(password)) {
                res.cookie(cookieName, login);
                res.status(httpStatus.PERMANENT_REDIRECT).redirect('/posts');
            } else {
                res.status(httpStatus.UNAUTHORIZED).send('Wrong password, try /login again');
            }
        });
    }
};

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