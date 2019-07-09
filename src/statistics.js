const fs = require('fs');
const blogPosts = JSON.parse(fs.readFileSync('./data/posts.json', 'utf8'));

console.log('Curent blog posts :');
blogPosts.forEach(post => console.log("Title - " + post.title + ", created - " + post.createdAt));
console.log('Overall number of posts = ', blogPosts.length);

//Implementation - export as module later
const countPosts = function (posts) { 
    let perDay = 0;
    let perWeek = 0;
    let perMonth = 0;

    const today = Date.now();

    for (i = 0; i < posts.length; i++) { 
        const diffTime = Math.abs(today - Date.parse(posts[i].createdAt));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if(diffDays <= 1){
            perDay++;
        }
        if(diffDays <= 7){
            perWeek++;            
        }
        if(diffDays <= 30){
            perMonth++;            
        }
    }
    
    return {postsPerDay: perDay, postsPerWeek: perWeek, postsPerMonth: perMonth};
}

//TODO move checks to unit tests
const postsStatistics = countPosts(blogPosts);
console.log(postsStatistics);