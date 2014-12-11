var hs = require('../lib/hackhall-sendgrid');

exports.add = function(req, res, next) {
  req.db.User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    displayName: req.body.displayName,
    headline: req.body.headline,
    photoUrl: req.body.photoUrl,
    password: req.body.password,
    email: req.body.email,
    angelList: {
      blah: 'blah'
    },
    angelUrl: req.body.angelUrl,
    twitterUrl: req.body.twitterUrl,
    facebookUrl: req.body.facebookUrl,
    linkedinUrl: req.body.linkedinUrl,
    githubUrl: req.body.githubUrl
  }, function(err, obj) {
    if (err) return next(err);
    if (!obj) return next('Cannot create.')
    res.json(200, obj);
  })
};

exports.update = function(req, res, next) {
  var data = req.body;
  delete data._id;
  if (req.body.stripeToken) {
    hs.notifyCc(req.session.user);
  }
  req.db.User.findByIdAndUpdate(req.session.user._id, {
    $set: data
  }, function(err, obj) {
    if (err) return next(err);
    if (!obj) return next('Cannot save.');
    res.status(200).json(obj);
  });
};

exports.get = function(req, res, next) {
  req.db.User.findById(req.session.user._id,
    'firstName lastName photoUrl headline displayName angelUrl facebookUrl twitterUrl linkedinUrl githubUrl email isStripeToken stripeToken', {}, function(err, user) {
      if (err) next(err);
      if (!user) next('cannot find');
      var obj = user.toObject();
      obj.stripePub = req.conf.stripePub;
      obj.isStripeToken = (obj.stripeToken!=null)
      delete obj.stripeToken //remove sensetive data
      res.status(200).json(obj);
    })
};