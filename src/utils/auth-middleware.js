const path = require('path');
const User = require('../models/User.js');
const auth = require(path.join(__dirname, '../utils/auth.js'));
const { cookieName } = require('../config.js');

//Middleware to check permittions
const authorizeByCookie = function (rule) {
    return function (req, res, next) {
        const cookie = req.cookies[cookieName];
        if (cookie) {
            const login = cookie;
            User.findOne({ login: login }, function (err, doc) {
                return auth.canUser(rule, doc) ? next() : res.status(401).send('No permission to procced for this user, try /login with another one');
            });            
        } else {
            res.status(httpStatus.UNAUTHORIZED).send('User must be logged in, try /login');
        }
    }
};

module.exports = authorizeByCookie;