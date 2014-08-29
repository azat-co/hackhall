> Invite-only community and social collaboration platform for programmers, startupers, JavaScript professionals and pirates.


## Express 4 Update

This is Express 4.x version.

For Express 3.x go to [release 2.0.1](https://github.com/azat-co/hackhall/releases/tag/v2.0.1).


## Live Demo

<http://hackhall.com>

## Setup

Clone the repo.

For AngelList setup have `.env` file with:

```
ANGELLIST_CLIENT_ID=YYYYYYYYYYYYYYYYYYYYYYYYYYYYY
ANGELLIST_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

Other `.env` vars:

```
GITHUB_CLIENT_ID=ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
GITHUB_CLIENT_SECRET=ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
GITHUB_CLIENT_ID_LOCAL=ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
GITHUB_CLIENT_SECRET_LOCAL=ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
SENDGRID_USERNAME=ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
SENDGRID_PASSWORD=ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
COOKIE_SECRET=ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
SESSION_SECRET=ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
```

Then run `foreman start`, or `node server.js`, or `node .`, `npm start`.


Heroku/cloud config:

```
NODE_ENV=production
```


> Built with Backbone.js, Mongoose and Express.js.


## Tests

To seed data and run tests:

```
$ npm test
```

or

```
$ make test
```

Just to run tests:

```
$ node seed.js
```