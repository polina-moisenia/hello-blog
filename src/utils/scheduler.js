const { CronJob } = require('cron');
schedulerFrequency = '* * * * * *';

module.exports.scheduleTask = (sheduledTask) => {
    try {
        const cronJob = new CronJob(schedulerFrequency, sheduledTask);
        cronJob.start();
    } catch (error) {
        console.log(`Scheduler error ${error}`);
    }
}