const path = require('path');
const fs = require('fs');
const { Worker } = require('worker_threads');
const { scheduleTask } = require('../utils/scheduler.js');
const { postsDataLocation } = require('../config.js');

let postsStats;
scheduleTask(() => {
    const postsCollection = JSON.parse(fs.readFileSync(postsDataLocation, 'utf8'));
    const worker = new Worker(path.join(__dirname, '../utils/worker.js'), { workerData: postsCollection });
    worker.on('message', msg => postsStats = msg);
    worker.on('error', err => console.error(`Worker error: ${err}`));
});

const getPostsStatistics = function (req, res) {
    res.json(postsStats);
};

module.exports = {
    getPostsStatistics
}