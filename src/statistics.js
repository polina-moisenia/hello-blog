module.exports = function (posts) {
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