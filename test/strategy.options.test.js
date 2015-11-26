var fs = require('fs');
var GitBookStrategy = require('../lib/strategy');

describe('Strategy#userProfile', function() {

    describe('loading profile using custom URL', function() {
        var strategy =  new GitBookStrategy({
                clientID: 'ABC123',
                clientSecret: 'secret',
                userProfileURL: 'https://gitbook.corpDomain/api/account'
            },
            function() {});

        // mock
        strategy._oauth2.get = function(url, accessToken, callback) {
            if (url != 'https://gitbook.corpDomain/api/account') { return callback(new Error('wrong url argument')); }
            if (accessToken != 'token') { return callback(new Error('wrong token argument')); }

            var body = fs.readFileSync('test/data/example.json', 'utf8');

            callback(null, body, undefined);
        };


        var profile;

        before(function(done) {
            strategy.userProfile('token', function(err, p) {
                if (err) { return done(err); }
                profile = p;
                done();
            });
        });

        it('should parse profile', function() {
            expect(profile.provider).to.equal('gitbook');

            expect(profile.id).to.equal('55c7c38d86606665de70a555');
            expect(profile.username).to.equal('samypesse');
            expect(profile.displayName).to.equal('Samy Pessé');
            expect(profile.profileUrl).to.equal('https://www.gitbook.com/@samypesse');
            expect(profile.emails).to.have.length(1);
            expect(profile.emails[0].value).to.equal('samypesse@gmail.com');
        });

        it('should set raw property', function() {
            expect(profile._raw).to.be.a('string');
        });

        it('should set json property', function() {
            expect(profile._json).to.be.an('object');
        });
    });

});
