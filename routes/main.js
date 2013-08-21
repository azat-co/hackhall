exports.checkAdmin = function (request, response, next){
	if (request.session && request.session.auth && request.session.userId && request.session.admin) {
		console.log('ADMIN: '+request.session.userId);
		return next();
	}
	else {
		next("User is an administrator.");
	}
};
exports.checkUser = function(req, res, next){
	if (req.session && req.session.auth && req.session.userId && (req.session.user.approved || req.session.admin) ) {
		console.log('USER: '+req.session.userId);
		return next();
	}
	else {
		next("User is not logged in.");
	}	
};
exports.checkApplicant = function(req, res, next){
	if (req.session && req.session.auth && req.session.userId && (!req.session.user.approved || req.session.admin) ) {
		console.log('USER: '+req.session.userId);
		return next();
	}
	else {
		next("User is not logged in.");
	}	
};

exports.login = function  (req, res, next){
	req.db.User.findOne({email: req.body.email, password: req.body.password}, null, {safe:true}, function(err,obj) {
		if (err) next(err);
		if (obj) {
			req.session.auth=true;
			req.session.userId = obj._id.toHexString();
			req.session.user = obj;
			if (obj.admin) {
				req.session.admin = true;
			}
			console.log('USER!: '+req.session.userId);
			res.json(200,{msg:"Authorized"});
		}
		else {
			next('User is not found');
		}
	});
};
exports.logout = function  (req, res) {
	req.session.destroy(function(error){
		if (!error) {
			res.send({msg:"Logged out"});
		}
	});
};
// mongo.Db.connect(dbUrl, function(error, client){
// 	if (error) throw error;
// 	else {
// 		db=client;
// 		invites = new mongo.Collection(db, "invites");
// 		users = new mongo.Collection(db, "users");
// 		posts = new mongo.Collection(db, "posts");		
		// if (require.main === module) {
		// }
		// else {
		// 	app.listen(app.get('port'), function(){
		// 		console.log("Express server listening on port " + app.get('port'));
		// 	});
		// }		
		// invites.remove();
		// users.remove();
		// posts.remove();
		// invites.insert({code:'smrules'});
		// users.insert(seedUser);
		// posts.insert({title:'test',text:'testbody',author:{name:seedUser.displayName, id:seedUser._id}});
	// }
// });

exports.signup = function  (request, response) {
	//TODO validate!
	// invites.findOne({code:request.body.code},function(error, object){		
	// 	if (!error && object ) {
	// 		users.insert({
	// 			firstname: request.body.firstname,
	// 			lastname: request.body.lastname,
	// 			displayname: request.body.firstname+" "+request.body.lastname,
	// 			password: request.body.password,
	// 			email: request.body.email
	// 		}, {safe:true}, function (error, object){
	// 			if (!error) {
	// 				console.log('signed up');
	// 				login(request, response);
	// 			}
	// 		});
	// 	}
	// 	else {
	// 		response.send({msg:"Code is not found"});
	// 	}
	// });
}
exports.profile = function (req, res, next){
	req.db.User.findById(req.session.userId, 'firstName lastName displayName headline photoUrl admin approved banned role angelUrl twitterUrl facebookUrl linkedinUrl githubUrl'
	,function(err, obj){
		if (err) next(err);
		if (!obj) next(new Error('User is not found'));
		req.db.Post.find({author:{id:obj._id, name:obj.displayName}}, null, {sort:{'created':-1}}, function(err,list){
			if (err) next(err);
			obj.posts.own = list || [];	
			req.db.Post.find({likes:obj._id}, null,  {sort:{'created':-1}}, function(err,list){
				if (err) next(err);
				obj.posts.likes = list || [];	
				req.db.Post.find({watches:obj._id}, null,  {sort:{'created':-1}}, function(err,list){
					if (err) next(err);
					obj.posts.watches = list || [];	
					req.db.Post.find({'comments.author.id':obj._id}, null,  {sort:{'created':-1}}, function(err,list){						
						if (err) next(err);
						obj.posts.comments = [];	
						list.forEach(function (value, key, list) {
							obj.posts.comments.push(value.comments.filter(function(el, i, arr){
								return (el.author.id.toString()==obj._id.toString());
							}));
						});			
						res.json(200,obj);			
					});
				});				
			});			
		});
	});
};
exports.delProfile = function (req, res, next){
	console.log('del profile');
	console.log(req.session.userId);
	req.db.User.findByIdAndRemove(req.session.user._id,{}, function(err,obj) {
		if (err) next(err);
		req.session.destroy(function(error){
			if (err) {
				next(err)
			}
		});		
		res.json(200,obj);
	});
	
};