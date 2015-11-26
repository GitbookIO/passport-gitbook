# Passport-GitBook

[![npm version](https://badge.fury.io/js/passport-gitbook.svg)](http://badge.fury.io/js/passport-gitbook)
[![Build Status](https://travis-ci.org/GitbookIO/passport-gitbook.svg?branch=master)](https://travis-ci.org/GitbookIO/passport-gitbook)

[Passport](http://passportjs.org/) strategy for authenticating with [GitBook](https://www.gitbook.com/)
using the OAuth 2.0 API.

This module lets you authenticate using GitBook in your Node.js applications.
By plugging into Passport, GitBook authentication can be easily and
unobtrusively integrated into any application or framework that supports
[Connect](http://www.senchalabs.org/connect/)-style middleware, including
[Express](http://expressjs.com/).

## Install

```
$ npm install passport-gitbook
```

## Usage

#### Configure Strategy

The GitBook authentication strategy authenticates users using a GitBook account
and OAuth 2.0 tokens.  The strategy requires a `verify` callback, which accepts
these credentials and calls `done` providing a user, as well as `options`
specifying a client ID, client secret, and callback URL.

```js
passport.use(new GitBookStrategy({
    clientID: GITBOOK_CLIENT_ID,
    clientSecret: GITBOOK_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/gitbook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ gitbookId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```

#### Authenticate Requests

Use `passport.authenticate()`, specifying the `'gitbook'` strategy, to
authenticate requests.

For example, as route middleware in an [Express](http://expressjs.com/)
application:

```js
app.get('/auth/gitbook',
  passport.authenticate('gitbook'));

app.get('/auth/gitbook/callback',
  passport.authenticate('gitbook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
```

#### With GitBook Enterprise

`GitBookStrategy` works well with [GitBook Enterprise](https://enterprise.gitbook.com):

```js
passport.use(new GitBookStrategy({
    clientID: GITBOOK_CLIENT_ID,
    clientSecret: GITBOOK_CLIENT_SECRET,
    endpoint: "https://gitbook.myCompany.com/api/"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ gitbookId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
```
