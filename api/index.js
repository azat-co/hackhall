var mongo = require('mongodb');

exports.signup = function(req, res){
	res.json('{test:"test"}');
};
exports.login = function(req, res){
	console.log(req.body.username);
	var users = new mongo.Collection(db, "users");
	users.find({username: req.body.username, password: req.body.password}).toArray(function(error, list) {
		// if (error) res.send(500);
		if (list.length==1) {
			res.json({msg:"Authorized"});
		}
		else {
			res.json({msg:"Not authorized"});			
		}
	});

};
exports.logout = function(req,res){
	res.json({msg:"logged out"});
}