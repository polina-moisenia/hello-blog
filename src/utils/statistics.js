module.exports = function (posts) {
    const today = Date.now();
    return posts.reduce((result, item) => {
        const diffTime = Math.abs(today - Date.parse(item.createdAt));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 1) { result.postsPerDay++; }
        if (diffDays <= 7) { result.postsPerWeek++; }
        if (diffDays <= 30) { result.postsPerMonth++; }

        return result;
    }, { postsPerDay: 0, postsPerWeek: 0, postsPerMonth: 0 });
}