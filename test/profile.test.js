var fs = require('fs');
var parse = require('../lib/profile').parse;


describe('profile.parse', function() {
    describe('example profile', function() {
        var profile;

        before(function(done) {
            fs.readFile('test/data/example.json', 'utf8', function(err, data) {
                if (err) { return done(err); }
                profile = parse(data);
                done();
            });
        });

        it('should parse profile', function() {
            expect(profile.id).to.equal('55c7c38d86606665de70a555');
            expect(profile.username).to.equal('samypesse');
            expect(profile.displayName).to.equal('Samy Pessé');
            expect(profile.profileUrl).to.equal('https://www.gitbook.com/@samypesse');
            expect(profile.emails).to.have.length(1);
            expect(profile.emails[0].value).to.equal('samypesse@gmail.com');
        });
    });

    describe('example profile with null email', function() {
        var profile;

        before(function(done) {
            fs.readFile('test/data/example-null-email.json', 'utf8', function(err, data) {
                if (err) { return done(err); }
                profile = parse(data);
                done();
            });
        });

        it('should parse profile', function() {
            expect(profile.id).to.equal('55c7c38d86606665de70a555');
            expect(profile.username).to.equal('samypesse');
            expect(profile.displayName).to.equal('Samy Pessé');
            expect(profile.profileUrl).to.equal('https://www.gitbook.com/@samypesse');
            expect(profile.emails).to.be.undefined;
        });
    });
});
