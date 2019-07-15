const fs = require('fs');
const blogPosts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf8'));

console.log('Curent blog posts :');
blogPosts.forEach(post => console.log(`Title - ${post.title}, created - ${post.createdAt}`));
console.log(`Overall number of posts = ${blogPosts.length}`);

//Implementation - export as module later
const countPosts = function (posts) {
    const today = Date.now();
    return posts.reduce((result, item) => {
        const diffTime = Math.abs(today - Date.parse(item.createdAt));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) { result.perDay++; }
        if (diffDays <= 7) { result.perWeek++; }
        if (diffDays <= 30) { result.perMonth++; }

        return result;
    }, { perDay: 0, perWeek: 0, perMonth: 0 });
}

//TODO move checks to unit tests
const postsStatistics = countPosts(blogPosts);
console.log(postsStatistics);