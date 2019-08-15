const mongoose = require('mongoose');
const db = require('../config.js').usersDB;

const connectMongoDB = function () {
    mongoose
        .connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true
        })
        .then(() => {
            console.log('MongoDB connected...');
        })
        .catch(err => console.log(err));
}

module.exports = connectMongoDB;