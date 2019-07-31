const mongoose = require('mongoose');
const db = "mongodb+srv://admin:admin@blog-cluster-tfscs.mongodb.net/blog"

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