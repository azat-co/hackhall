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
		if (err) next(err);
		if (!obj) next('Cannot create.')
		res.json(200, obj);
	})
};

exports.update = function(req, res, next) {
	var data = {};
	Object.keys(req.body).forEach(function(k) {
		if (req.body[k]) {
			data[k] = req.body[k];
		}
	});
	delete data._id;
	req.db.User.findByIdAndUpdate(req.session.user._id, {
		$set: data
	}, function(err, obj) {
		if (err) next(err);
		if (!obj) next('Cannot save.')
		res.json(200, obj);
	});
};

exports.get = function(req, res, next) {
	req.db.User.findById(req.session.user._id,
		'firstName lastName photoUrl headline displayName angelUrl facebookUrl twitterUrl linkedinUrl githubUrl', {}, function(err, obj) {
			if (err) next(err);
			if (!obj) next('cannot find');
			res.json(200, obj);
		})
};