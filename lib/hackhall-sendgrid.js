var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME,
  process.env.SENDGRID_PASSWORD);

var adminEmail = process.env.EMAIL || 'admin.hackhall@mailinator.com';

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
  var emailToApplicant = {
    to: user.email,
    bcc: adminEmail,
    subject: 'You applied to HackHall.com',
    text: 'I wanted to thank you for applying to HackHall.com. However, in order for me to approve your application you need to agree to a membership fee and put your credit/debit card on file. Did you see the authorization button? http://hackhall.com/#application'
  }
  _send(emailToApplicant, function(error, json){
    if (error) return callback(error)
    var emailToAdmin = {
      to: adminEmail,
      subject: 'New Application',
      text: 'There is a new application from ' + user.email + '. CC status: ' + (user.stripeToken!=null) +
        '. ID: ' + user._id
    };
    _send(emailToAdmin, callback);
  })

};

exports.notifyApproved = function(user, callback) {
  var email = {
    to: user.email,
    bcc: adminEmail,
    subject: 'HackHall Approved Your Application',
    text: 'HackHall Approved Your Application. \r\n Welcome! '
  };
  _send(email, callback);
};


exports.notifyCc = function(user, callback){
  var email = {
    to: adminEmail,
    subject: 'New credit card on file',
    text:  'There is a new CC from ' + user.email +
      '. ID: ' + user._id
  }
  _send(email, callback);
}