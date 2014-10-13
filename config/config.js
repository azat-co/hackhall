var path = require('path');
var env = process.env.NODE_ENV;
var app = require('../package.json');

if (env === 'production' || env === 'staging' || env === 'development') {
    notifier.email = true;
}

module.exports = {
  development: {
    appName: 'My',  // This gets added to the the name Hackhall e.g. Value='TOR' would give 'TOR Hackhall' as the App name throughout the site
    sendgridEmailFrom: 'hi@hackhall.com',
    sendgridAdminEmail: 'hi@azat.com',
    root: path.normalize(__dirname + '/..'),
    db: 'mongodb://localhost/hackhall',
    domain: 'localhost:3000',
    session_secret_key: 'sid'
  },

  staging: {
    appName: 'My',
    sendgridEmailFrom: 'hi@hackhall.com',
    sendgridAdminEmail: 'hi@azat.com',
    root: path.normalize(__dirname + '/..'),
    db: process.env.MONGOHQ_URL,
    domain: 'beta.com',  // Enter your Heroku or Hosting provider address here
    session_secret_key: 'sid'
  },

  production: {
    appName: 'My',
    sendgridEmailFrom: 'hi@hackhall.com',
    sendgridAdminEmail: 'hi@azat.com',
    root: path.normalize(__dirname + '/..'),
    db: process.env.MONGOHQ_URL,
    domain: 'hackhall.com',
    session_secret_key: 'sid',
    gitHubOptions_callbackURL: 'http://127.0.0.1:3000/auth/github/callback'
  }
};
