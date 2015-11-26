var util = require('util');
var url = require('url');
var OAuth2Strategy = require('passport-oauth2');
var Profile = require('./profile');
var InternalOAuthError = OAuth2Strategy.InternalOAuthError;


/**
 * `Strategy` constructor.
 *
 * The GitBook authentication strategy authenticates requests by delegating to
 * GitBook using the OAuth 2.0 protocol.
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `done`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid.  If an exception occured, `err` should be set.
 *
 * Options:
 *   - `clientID`      your GitBook application's Client ID
 *   - `clientSecret`  your GitBook application's Client Secret
 *   - `callbackURL`   URL to which GitBook will redirect the user after granting authorization
 *   — `userAgent`     All API requests MUST include a valid User Agent string.
 *                     e.g: domain name of your application.
 *
 * Examples:
 *
 *     passport.use(new GitBookStrategy({
 *         clientID: '123-456-789',
 *         clientSecret: 'shhh-its-a-secret'
 *         callbackURL: 'https://www.example.net/auth/gitbook/callback',
 *         userAgent: 'myapp.com'
 *       },
 *       function(accessToken, refreshToken, profile, done) {
 *         User.findOrCreate(..., function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
 */
function Strategy(options, verify) {
    options = options || {};
    options.endpoint = options.endpoint || 'https://api.gitbook.com/';

    options.authorizationURL = options.authorizationURL || url.resolve(options.endpoint, 'oauth/authorize');
    options.tokenURL = options.tokenURL || url.resolve(options.endpoint, 'oauth/access_token');
    options.scopeSeparator = options.scopeSeparator || ',';
    options.customHeaders = options.customHeaders || {};

    if (!options.customHeaders['User-Agent']) {
        options.customHeaders['User-Agent'] = options.userAgent || 'passport-gitbook';
    }

    OAuth2Strategy.call(this, options, verify);
    this.name = 'gitbook';
    this._userProfileURL = options.userProfileURL || url.resolve(options.endpoint, 'account');
    this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


/**
 * Retrieve user profile from GitBook.
 *
 * This function constructs a normalized profile, with the following properties:
 *
 *   - `provider`         always set to `gitbook`
 *   - `id`               the user's GitBook ID
 *   - `username`         the user's GitBook username
 *   - `displayName`      the user's full name
 *   - `profileUrl`       the URL of the profile for the user on GitBook
 *   - `emails`           the user's email addresses
 *
 * @param {String} accessToken
 * @param {Function} done
 * @api protected
 */
Strategy.prototype.userProfile = function(accessToken, done) {
    this._oauth2.get(this._userProfileURL, accessToken, function (err, body, res) {
        var json;

        if (err) {
            return done(new InternalOAuthError('Failed to fetch user profile', err));
        }

        try {
            json = JSON.parse(body);
        } catch (ex) {
            return done(new Error('Failed to parse user profile'));
        }

        var profile = Profile.parse(json);
        profile.provider  = 'gitbook';
        profile._raw = body;
        profile._json = json;

        done(null, profile);
    });
}

module.exports = Strategy;
