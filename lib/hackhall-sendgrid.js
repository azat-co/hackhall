var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD);

var _send = function(email, callback) {
  sendgrid.send({
    to:       email.to,
    from:     'hi@hackhall.com',
    subject:  email.subject,
    text:     email.text + '\r\n\r\n http://hackhall.com '
  }, function(err, json) {
    if (err) {
      console.error(err);
      return callback(err);
    }
    console.log(json);
    callback(null, json);
  });
};

exports.notifyNewApplication = function(user, callback) {
  var email = {
    to: process.env.EMAIL,
    subject: 'New Application',
    text: 'There is a new application from ' + user.email

  };
  _send(email, callback);
};

exports.notifyApproved = function(user, callback) {
  var email = {
    to: user.email,
    subject: 'HackHall Approved Your Application',
    text: 'HackHall Approved Your Application. \r\n Welcome! '
  };
  _send(email, callback);
};


exports.notifyCc = function(user, callback){
  var email = {
    to: process.env.EMAIL,
    subject: 'New credit card on file',
    text:  'There is a new CC from ' + user.email
  }
  _send(email, callback);
}