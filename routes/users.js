objectId = require('mongodb').ObjectID;

exports.getUsers = function(req, res, next) {
	if (req.session.auth && req.session.userId) {
		req.db.User.find({}, 'firstName lastName displayName headline photoUrl admin approved banned role angelUrl twitterUrl facebookUrl linkedinUrl githubUrl', function(err, list) {
			if (err) next(err);
			res.json(200, list);
		});
	} else {
		next('User is not recognized.')
	}
}

exports.getUser = function(req, res, next) {
	req.db.User.findById(req.params.id, 'firstName lastName displayName headline photoUrl admin approved banned role angelUrl twitterUrl facebookUrl linkedinUrl githubUrl', function(err, obj) {
		if (err) next(err);
		if (!obj) next(new Error('User is not found'));
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
						if (err) next(err);
						obj.posts.comments = [];
						list.forEach(function(value, key, list) {
							obj.posts.comments.push(value.comments.filter(function(el, i, arr) {
								return (el.author.id.toString() == obj._id.toString());
							}));
						});
						res.json(200, obj);
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
	var obj = req.body;
	obj.updated = new Date();
	delete obj._id;
	req.db.User.findByIdAndUpdate(req.params.id, {
		$set: obj
	}, {
		new: true
	}, function(err, obj) {
		if (err) next(err);
		res.json(200, obj);
	});
};

exports.del = function(req, res, next) {
	req.db.User.findByIdAndRemove(req.params.id, function(err, obj) {
		if (err) next(err);
		res.json(200, obj);
	});
};

exports.findOrAddUser = function(req, res, next) {
	data = req.angelProfile;
	req.db.User.findOne({
		angelListId: data.id
	}, function(err, obj) {
		console.log('angelListLogin4');
		if (err) next(err);
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
				if (err) next(err);
				console.log(obj);
				req.session.auth = true;
				req.session.userId = obj._id;
				req.session.user = obj;
				req.session.admin = false; //assing regular user role by default									
				res.redirect('/#application');
				// }
			});
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