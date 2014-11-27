var c = require('./colors');

var envVars = ['ANGELLIST_CLIENT_ID',
'ANGELLIST_CLIENT_SECRET',
'GITHUB_CLIENT_ID',
'GITHUB_CLIENT_SECRET',
'GITHUB_CLIENT_ID_LOCAL',
'GITHUB_CLIENT_SECRET_LOCAL',
'SENDGRID_USERNAME',
'SENDGRID_PASSWORD',
'COOKIE_SECRET',
'SESSION_SECRET',
'ANGELLIST_CLIENT_ID_LOCAL',
'ANGELLIST_CLIENT_SECRET_LOCAL',
'EMAIL']

envVars.forEach(function(variable, index, list){
  if (!process.env[variable]) console.warn(c.red + 'Warning: the environment variable ' + variable + ' is not set.' + c.reset)
})
