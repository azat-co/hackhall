var express = require('express'),
    routes = require('./routes'),
	api = require('./api'),
    http = require('http'),
	util = require('util'),
	oauth = require('oauth'),
	querystring = require('querystring');

var app = express();
app.configure(function(){
	app.set('port', process.env.PORT || 3000	);
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser("asd;lfkajs;ldfkj"));
	app.use(express.session({
		secret: "<h1>WHEEYEEE</h1>",
		key: 'sid',
		cookie: {
			secret: true,
			expires: false			
		}
	}));
	// app.use(express.csrf()); //TODO!
	app.use(express.static(__dirname + '/public'));
	app.use(app.router);
});

app.configure(function() {
	app.use(logErrors);
	app.use(clientErrorHandler);
	app.use(errorHandler);
});

function logErrors(err, req, res, next) {
	console.log('logErrors');
	console.error(err.stack);
	console.error(err);
	next(err);
}

function clientErrorHandler(err, req, res, next) {
	console.log('clientErrors');
			res.send(500, { error: err.toString() });
	if (req.xhr) {
		console.log(err);
		res.send(500, { error: err.toString() });
	} else {
		next(err);
	}
}

function errorHandler(err, req, res, next) {
	console.log('lastErrors');	
	res.send(500, {error:err.toString()});
}

var seedUser ={
	firstName:'Azat',lastName:"Mardanov", displayName:"Azat Mardanov",password:'1',email:'1@1.com',role:'admin'
}
var dbUrl = process.env.MONGOHQ_URL || "mongodb://@127.0.0.1:27017/AcceleratorIO";
var mongoose = require('mongoose');
var connection = mongoose.createConnection(dbUrl);
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {
});
var models = require('./models');
function db (req, res, next) {
	req.db = {
		User: connection.model('User', models.User, "users"),
		Post: connection.model('Post', models.Post, "posts")
	};
	return next();
}
checkUser = routes.main.checkUser;
checkAdmin = routes.main.checkAdmin;
checkApplicant = routes.main.checkApplicant;

app.get('/auth/angellist',routes.auth.angelList);
app.get('/auth/angellist/callback',routes.auth.angelListCallback, routes.auth.angelListLogin,db, routes.users.findOrAddUser);
//MAIN
app.get('/api/profile', checkUser,db, routes.main.profile);
app.del('/api/profile', checkUser,db, routes.main.delProfile);
app.post('/api/signup', routes.main.signup);
app.post('/api/login', db, routes.main.login);
app.post('/api/logout', routes.main.logout);
//POSTS
app.get('/api/posts', checkUser, db, routes.posts.getPosts);
app.post('/api/posts', checkUser, db, routes.posts.add);
app.get('/api/posts/:id', checkUser, db, routes.posts.getPost);
app.put('/api/posts/:id', checkUser, db, routes.posts.updatePost);
app.del('/api/posts/:id', checkUser, db, routes.posts.del);
//USERS
app.get('/api/users', checkUser, db, routes.users.getUsers);
app.get('/api/users/:id', checkUser, db, routes.users.getUser);
app.post('/api/users', checkAdmin, db, routes.users.add);
app.put('/api/users/:id', checkAdmin, db, routes.users.update);
app.del('/api/users/:id', checkAdmin, db, routes.users.del);
//APPLCATION 
app.post('/api/application', checkAdmin, db,routes.application.add); 
app.put('/api/application',checkApplicant, db, routes.application.update);
app.get('/api/application', checkApplicant, db, routes.application.get);

app.get('*', function(req,res){
	res.send(404);
});

http.createServer(app);
if (require.main === module) {
	app.listen(app.get('port'), function(){
		console.log("Express server listening on port " + app.get('port'));
	});
}
else {
	console.log('Running app as a module')
	exports.app = app;
}



