var path = require('path'),
  hs = require(path.join(__dirname, '..', 'lib', 'hackhall-sendgrid'));

var objectId = require('mongodb').ObjectID;

var safeFields = 'firstName lastName displayName headline photoUrl admin approved banned role angelUrl twitterUrl facebookUrl linkedinUrl githubUrl';
exports.getUsers = function(req, res, next) {
  if (req.session.auth && req.session.userId) {
    req.db.User.find({}, safeFields, function(err, list) {
      if (err) return next(err);
      res.status(200).json(list);
    });
  } else {
    return next('User is not recognized.')
  }
}

exports.getUser = function(req, res, next) {
  var fields = safeFields;
  if (req.session.admin) {
    fields = fields + ' email';
  }
  req.db.User.findById(req.params.id, fields, function(err, obj) {
    if (err) return next(err);
    if (!obj) return next(new Error('User is not found'));

    req.db.Post.find({
      author: {
        id: obj._id,
        name: obj.displayName
      }
    }, null, {
      sort: {
        'created': -1
      }
    }, function(err, list) {
      if (err) next(err);
      obj.posts.own = list || [];
      req.db.Post.find({
        likes: obj._id
      }, null, {
        sort: {
          'created': -1
        }
      }, function(err, list) {
        if (err) next(err);
        obj.posts.likes = list || [];
        req.db.Post.find({
          watches: obj._id
        }, null, {
          sort: {
            'created': -1
          }
        }, function(err, list) {
          if (err) next(err);
          obj.posts.watches = list || [];
          req.db.Post.find({
            'comments.author.id': obj._id
          }, null, {
            sort: {
              'created': -1
            }
          }, function(err, list) {
            if (err) return next(err);
            obj.posts.comments = [];
            list.forEach(function(value, key, list) { // async?
              obj.posts.comments.push(value.comments.filter(function(el, i, arr) {
                return (el.author.id.toString() == obj._id.toString());
              }));
            });
            res.status(200).json(obj);
          });
        });
      });
    });
  });
};

exports.add = function(req, res, next) {
  var user = new req.db.User(req.body);
  user.save(function(err) {
    if (err) next(err);
    res.json(user);
  });
};

exports.update = function(req, res, next) {
  // console.log(req.body);
  var obj = req.body;
  obj.updated = new Date();
  delete obj._id;
  var approvedNow = obj.approved && obj.approvedNow;
  delete obj.approved_now;
  req.db.User.findByIdAndUpdate(req.params.id, {
    $set: obj
  }, {
    new: true
  }, function(err, user) {
    if (err) return next(err);
    if (approvedNow && user.approved) {
      console.log('Approved... sending notification!');
      hs.notifyApproved(user, function(error, user){
        if (error) return next(error);
        console.log('Notification was sent.');
        res.status(200).json(user);
      })
    } else {
      res.status(200).json(user);
    }
  });
};

exports.del = function(req, res, next) {
  req.db.User.findByIdAndRemove(req.params.id, function(err, obj) {
    if (err) next(err);
    res.status(200).json(obj);
  });
};

exports.findOrAddUser = function(req, res, next) {
  data = req.angelProfile;
  req.db.User.findOne({
    angelListId: data.id
  }, function(err, obj) {
    console.log('angelListLogin4');
    if (err) return next(err);
    console.warn(obj);
    if (!obj) {
      req.db.User.create({
        angelListId: data.id,
        angelToken: token,
        angelListProfile: data,
        email: data.email,
        firstName: data.name.split(' ')[0],
        lastName: data.name.split(' ')[1],
        displayName: data.name,
        headline: data.bio,
        photoUrl: data.image,
        angelUrl: data.angellist_url,
        twitterUrl: data.twitter_url,
        facebookUrl: data.facebook_url,
        linkedinUrl: data.linkedin_url,
        githubUrl: data.github_url
      }, function(err, obj) { //remember the scope of variables!
          if (err) return next(err);
          console.log(obj);
          req.session.auth = true;
          req.session.userId = obj._id;
          req.session.user = obj;
          req.session.admin = false; //assing regular user role by default
          res.redirect('/#application');
          // }
        }
      );
    } else { //user is in the database
      req.session.auth = true;
      req.session.userId = obj._id;
      req.session.user = obj;
      req.session.admin = obj.admin; //false; //assing regular user role by default
      if (obj.approved) {
        res.redirect('/#posts');
      } else {
        res.redirect('/#application');
      }
    }
  })
}