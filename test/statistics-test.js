var assert = require('assert');
const statistics = require('../src/utils/statistics.js');

const d = new Date();
const posts = [
  { createdAt: new Date(d.setTime(d.getTime() - 3000)) },
  { createdAt: new Date(d.setDate(d.getDate() - 4)) },
  { createdAt: new Date(d.setDate(d.getDate() - 8)) }
];

const expetedStats = {
  postsPerDay: 1,
  postsPerWeek: 2,
  postsPerMonth: 3
};

describe('the only one test in the whole amazing solution', function () {
  describe('are you ready to see it?', function () {
    it('should calculate the posts statictics', function () {
      assert.deepEqual(statistics(posts), expetedStats);
    });
  });
});