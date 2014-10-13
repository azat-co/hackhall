var jade = require('jade')
var emailTemplates = require('./email-templates')
// console.log(emailTemplates)
// var html = jade.render('string of jade', options);
var template = jade.compile(emailTemplates.newApplication);
var data = {name: 'Tim'}
var html = template(data)
console.log(html)