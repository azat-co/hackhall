var	https = require('https');

var angelListClientId = process.env.ANGELLIST_CLIENT_ID;
var angelListClientSecret = process.env.ANGELLIST_CLIENT_SECRET;

var concat = require('concat-stream')

exports.angelList = function (req, res){
	res.redirect('https://angel.co/api/oauth/authorize?client_id='+angelListClientId+'&scope=email&response_type=code');
}
exports.angelListCallback = function (req,res,next){
	
	var aRes = concat(function(buffer){
		
	});		
	var token;
	var buf='';
	var data;
	console.log(req.query.code);
	console.log('/api/oauth/token?client_id='+angelListClientId+'&client_secret='+angelListClientSecret+'&code='+req.query.code+'&grant_type=authorization_code');
	var angelReq = https.request({
		host: 'angel.co',
		path: '/api/oauth/token?client_id='+angelListClientId+'&client_secret='+angelListClientSecret+'&code='+req.query.code+'&grant_type=authorization_code',
  		port: 443,
  		method: 'POST'},
		function(angelRes){

			angelRes.on('data', function(buffer){
				buf += buffer;
				console.log('inside aRes')
			});
			angelRes.on('end', function(){
				data = JSON.parse(buf.toString('utf-8'));
				token = data.access_token;
				req.session.angelListAccessToken = token;				
				if (token) next();
				else res.send(500);					
			});			
			// var body
		  	// angelRes.on('data', function(buffer) {
		  		// body += buffer
			// });
			// angelRes.on('end', function(){})
		// }
	// );	
	// angelReq.end();

	});    
	console.log(data)
	angelReq.end();
	angelReq.on('error', function(e) {
		console.error(e);
		next(e);
	});
}
exports.angelListLogin = function (req, res,next) {
	token = req.session.angelListAccessToken;
	httpsRequest = https.request({
		host: 'api.angel.co',
		path: '/1/me?access_token=' + token,
		port: 443,
		method: 'GET'},
		function (httpsResponse) {
			httpsResponse.on('data', function(buffer) {
				data = JSON.parse(buffer.toString('utf-8'));
				if (data) {
					req.angelProfile = data;
					next();
				}		
			});
		}
	);	
	httpsRequest.end();
	httpsRequest.on('error', function(e) {
		console.error(e);
	});
};
