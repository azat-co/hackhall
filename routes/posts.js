objectId = require('mongodb').ObjectID;
var red, blue, reset;
red   = '\u001b[31m';
blue  = '\u001b[34m';
reset = '\u001b[0m';
console.log(red + 'This is red' + reset + ' while ' + blue + ' this is blue' + reset);

var LIMIT = 10;
var SKIP = 0;

exports.add = function (req, res, next){
	console.warn("!!!");
	console.warn(red+req.session.user._id);
	console.warn(red+req.session.userId);
	console.warn(red+ req.session.user.displayName);
	if (req.body){
		req.db.Post.create({
			title: req.body.title,
			text: req.body.text || null,
			url: req.body.url || null,
			author: {
				id: req.session.user._id,
				name: req.session.user.displayName
			}
		},function(err, docs) {
			if (err) {
				console.log(err);
				next(err);
			}
			else {
				res.json(200,docs);
		    	console.dir(docs);			
			}

		});
	}
	else {
		next(new Error('No data'));
	}
};
exports.getPosts = function (req, res,next){	
	console.log(req.session.auth);
	console.log(req.session.userId);
	var limit = req.query.limit || LIMIT;
	var skip = req.query.skip || SKIP;	
	console.log(req.query.skip )
	req.db.Post.find({}, null,{limit:limit,skip:skip,sort:{'_id':-1}},function(err, obj){		
	// toArray(function(err, docs) {
	    // console.dir(obj);
		if (!obj) next('There are not posts.');
		obj.forEach(function(item, i, list){
			// console.log('!')
			// console.log(item.admin)
			if (req.session.user.admin){
				item.admin=true;
			}
			else {
				item.admin=false;
			}
			// console.log(item.admin)
			if (item.author.id==req.session.userId) {
				item.own = true;
			}			
			else {
				item.own =false;
			}
			// console.log(obj[i])
			if (item.likes && item.likes.indexOf(req.session.userId)>-1) {
				item.like = true;
			}
			else {
				item.like = false;
			}
			// console.log(item.like);
			if (item.watches && item.watches.indexOf(req.session.userId)>-1) {
				item.watch = true;
			}
			else {
				item.watch = false;
			}				
		});
		// console.dir(obj)
		var body={};
		body.limit = limit;
		body.skip = skip;
		body.posts=obj;
		req.db.Post.count({},function(err, total){
			if (err) next(err);
			body.total = total;
			// console.log(obj)
			res.json(200,body);			
		});

		// return next();
	});
};


exports.getPost = function (req, res, next){
	if (req.params.id) {
		req.db.Post.findById(req.params.id, {
			title: true,
			text: true,
			url: true,
			author: true,
			comments: true,
			watches:true,
			likes:true			
		},function(err, obj){
			if (err) next(err);
			if (!obj) {
				next("Nothing is found.");
			}
			else {
				res.json(200,obj);
			}
		});
	}
	else {
		next("No post id");
	}
};

exports.del = function (req, res, next){	
	req.db.Post.findById(req.params.id, function(err,obj){
		if (err) next(err);
		if (req.session.admin || req.session.userId === obj.author.id) {
			obj.remove();
			res.json(200,obj);
		}		
		else {
			next('User is not authorized to delete post.');
		}
	})

};
function likePost (req, res, next){
	req.db.Post.findByIdAndUpdate(req.body._id,{$push:{
		likes: req.session.userId
	}},{},function(err,obj){
		console.log(obj)
		if (err) {
			next(err);
		}
		else {
			res.json(200,obj);
		}
	});	
};
function watchPost (req, res, next){
	req.db.Post.findByIdAndUpdate(req.body._id,{$push:{
		watches: req.session.userId
	}},{},function(err,obj){
		if (err) next(err);
		else {
			res.json(200,obj);
		}
	});
};
exports.updatePost = function (req, res, next){	
	var anyAction = false;
	if (req.body._id && req.params.id) {     
		if (req.body && req.body.action == "like" ) {     			
			anyAction = true;
			likePost(req,res);
		}
		if (req.body && req.body.action == "watch" ) {     
			anyAction = true;
			watchPost(req,res);
		}
		if (req.body && req.body.action =="comment" && req.body.comment && req.params.id) {     
			console.log('comment');
			anyAction = true;
			req.db.Post.findByIdAndUpdate(req.params.id,{
				$push:{
					comments: {
						author: {
							id: req.session.userId,
							name: req.session.user.displayName
						},
						text: req.body.comment
					}			
			}},{safe:true, new:true}, function(err, obj) {
				if (err) throw err;
				console.log('commented')
		    	console.dir(obj);
				res.json(200,obj);
				// res.send(200);
			});
		}
		if (req.session.auth && req.session.userId && req.body && req.body.action!="comment" && req.body.action!="watch" && req.body!='like' && req.params.id && (req.body.author.id == req.session.user._id || req.session.user.admin) ) {     
			console.log('update')
			req.db.Post.findById(req.params.id, function (err, doc) {
				if (err) next(err);
				doc.title = req.body.title;
				doc.text= req.body.text || null;
				doc.url= req.body.url || null;
				doc.save(function(e,d){
					if (e) next(e);
					res.json(200,d);
				});
			})			
			// req.db.Post.findByIdAndUpdate(req.params.id,{
			// 	$set:{
			// 		title: req.body.title,
			// 		text: req.body.text || null,
			// 		url: req.body.url || null ,
			// 		updated: new Date()
			// }},{safe:true, new:true}, function(err, obj) {
			// 	if (err) next(err);
			// 		    	console.dir(obj);
			// 	res.json(200,obj);
			// });
		}
		else {
			if (!anyAction) next('Something went wrong.');
		}
		
	}
	else {
		next("No post ID.");	
	}	
};