const fs = require('fs');
const blogPosts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf8'));
const statistics = require('../src/statistics.js');

console.log('Curent blog posts :');
blogPosts.forEach(post => console.log(`Title - ${post.title}, created - ${post.createdAt}`));
console.log(`Overall number of posts = ${blogPosts.length}`);

//TODO change for assert
const postsStatistics = statistics(blogPosts);
console.log(postsStatistics);