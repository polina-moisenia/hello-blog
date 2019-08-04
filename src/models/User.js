const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        userId: {
            type: String
        },
        name: {
            type: String
        },
        login: {
            type: String
        },
        password: {
            type: String
        },
        gravatarProfile: {
            type: Object
        }
    }
);

UserSchema.methods.setPassword = function (password) {
    this.password = getPasswordHash(password);
}

UserSchema.methods.validPassword = function (password) {
    return this.password === getPasswordHash(password);
};

getPasswordHash = function (password){
    return crypto.pbkdf2Sync(password, `12`, 1000, 64, `sha512`).toString(`hex`);
}

const User = mongoose.model('User', UserSchema, 'users');
module.exports = User;