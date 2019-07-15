const fs = require('fs');
const bcrypt = require('bcrypt');
const auth = require('./auth.js');

var usersCollection = JSON.parse(fs.readFileSync('./data/users.json', 'utf8'));
const cookieName = 'logged-in';

//Login
const setCookie = function (req, res) {
    var cookie = req.cookies[cookieName];
    if (cookie === undefined) {
        const login = req.body.login;
        const password = req.body.password;
        if (login === undefined || password === undefined) {
            res.status(400).send('Bad request');
        }

        const [userFound] = usersCollection.filter(user => user.login === login);
        if (!userFound) {
            res.status(401).send('Wrong user, try /login again');
        } else if (!checkPasswordForUser(userFound, password)) {
            res.status(401).send('Wrong password, try /login again');
        } else {
            res.cookie(cookieName, login);
            res.status(200).send('Logged in');
        }
    } else {
        res.status(200).send('Already logged in, log out first');
    }
};

const checkPasswordForUser = function (user, password) {
    return bcrypt.compareSync(password, user.password);
}

//Logout
const deleteCookie = function (req, res) {
    var cookie = req.cookies[cookieName];
    if (cookie === undefined) {
        res.status(200).send('Already logged out');
    } else {
        res.clearCookie(cookieName);
        res.status(200).send('Logged out');
    }
};

//Middleware to check permittions
const authorizeByCookie = function (rule, req, res, next) {
    var cookie = req.cookies[cookieName];
    if (cookie === undefined) {
        res.status(401).send('User must be logged in, try /login');
    } else {
        const login = cookie;
        const [userFound] = usersCollection.filter(user => user.login === login);
        auth.canUser(rule, userFound) ? next() : res.status(401).send('No permission to procced for this user, try /login with another one');
    }
};

module.exports = {
    setCookie,
    deleteCookie,
    authorizeByCookie
};