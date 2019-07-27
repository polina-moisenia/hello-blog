const fs = require('fs');
const bcrypt = require('bcrypt');
const path = require('path');
const auth = require(path.join(__dirname, '../utils/auth.js'));
const { usersDataLocation } = require('../config.js');
const usersCollection = JSON.parse(fs.readFileSync(usersDataLocation, 'utf8'));
const cookieName = 'logged-in';

//Login
const setCookie = function (req, res) {
    const cookie = req.cookies[cookieName];
    if(cookie){
        res.status(302).redirect('/posts');
    } else {
        const login = req.body.login;
        const password = req.body.password;
        if (!login || !password) {
            res.status(400).send('Bad request');
        }

        const [userFound] = usersCollection.filter(user => user.login === login);
        if (!userFound) {
            res.status(401).send('Wrong user, try /login again');
        } else if (!checkPasswordForUser(userFound, password)) {
            res.status(401).send('Wrong password, try /login again');
        } else {
            res.cookie(cookieName, login);
            res.status(302).redirect('/posts');
        }
    }
};

const checkPasswordForUser = function (user, password) {
    return bcrypt.compareSync(password, user.password);
}

//Logout
const deleteCookie = function (req, res) {
    const cookie = req.cookies[cookieName];
    if(cookie) {
        res.clearCookie(cookieName);
        res.status(200).send('Logged out');
    } else {
        res.status(403).send('Already logged out');
    }
};

//Middleware to check permittions
const authorizeByCookie = function (rule) {
    return function (req, res, next) {
        const cookie = req.cookies[cookieName];
        if(cookie){
            const login = cookie;
            const [userFound] = usersCollection.filter(user => user.login === login);
            auth.canUser(rule, userFound) ? next() : res.status(401).send('No permission to procced for this user, try /login with another one');
        } else{
            res.status(401).send('User must be logged in, try /login');
        }
    }
};

module.exports = {
    setCookie,
    deleteCookie,
    authorizeByCookie
};