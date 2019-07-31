const statistics = require('./statistics.js');
const { parentPort, workerData } = require('worker_threads');

parentPort.postMessage(statistics(workerData));
