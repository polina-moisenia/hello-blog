const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        userId: {
            type: String,
        },
        name: {
            type: String,
        },
        login: {
            type: String,
        },
        password: {
            type: String,
        }
    }
);

const User = mongoose.model('User', UserSchema, 'users');
module.exports = User;