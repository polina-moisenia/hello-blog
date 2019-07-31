var md5 = require('md5');
const fetch = require('node-fetch');

module.exports.getGravatarProfile = async function (email) {
    const emailHash = md5(email.trim().toLowerCase());
    const response = await fetch(`http://www.gravatar.com/${emailHash}.json`);

    if (response.ok) return await response.json();
    return response.statusText;
}