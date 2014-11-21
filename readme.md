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

# License

The MIT License (MIT)

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
