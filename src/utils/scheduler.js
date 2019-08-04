const { CronJob } = require('cron');
schedulerFrequency = require(`../config.js`).freq;

module.exports.scheduleTask = (sheduledTask) => {
    try {
        const cronJob = new CronJob(schedulerFrequency, sheduledTask);
        cronJob.start();
    } catch (error) {
        console.log(`Scheduler error ${error}`);
    }
}