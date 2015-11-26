// Parse GitBook profile
function parse(json) {
    if ('string' == typeof json) {
        json = JSON.parse(json);
    }

    var profile = {};
    profile.id = String(json.id);
    profile.displayName = json.name;
    profile.username = json.username;
    profile.profileUrl = json.urls.profile;
    if (json.email) {
        profile.emails = [{ value: json.email }];
    }

    return profile;
}

module.exports = {
    parse: parse
};
