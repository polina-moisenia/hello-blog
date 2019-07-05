function countPosts (posts) {
    console.log('Overall number of posts', posts.length);

    let perDay = 0;
    let perWeek = 0;
    let perMonth = 0;

    let today = Date.now();

    for (i = 0; i < posts.length; i++) { 
        let diffTime = Math.abs(today - Date.parse(posts[i].createdAt));
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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
    
    let statistics = {postsPerDay: perDay, postsPerWeek: perWeek, postsPerMonth: perMonth};
    console.log(statistics);
    //TODO return value
}
   
const readFromDB = function (fileName, processData) {
    const fs = require('fs')
    fs.readFile(fileName, 'utf8', (err, jsonEnities) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        console.log('File data:', jsonEnities);

        try {
            let posts = JSON.parse(jsonEnities);
            processData(posts);
        } catch(err) {
            console.log('Error parsing JSON string:', err);
        }
    })
}

readFromDB('./data/posts.json', countPosts);
//readFromDB('./data/comments.json');
//readFromDB('./data/users.json');