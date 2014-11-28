var https = require('https');

if (process.env.NODE_ENV === 'production') {
  var angelListClientId = process.env.ANGELLIST_CLIENT_ID;
  var angelListClientSecret = process.env.ANGELLIST_CLIENT_SECRET;
} else {
  var angelListClientId = process.env.ANGELLIST_CLIENT_ID_LOCAL;
  var angelListClientSecret = process.env.ANGELLIST_CLIENT_SECRET_LOCAL;
}

exports.angelList = function(req, res) {
  // req.session.destroy();
  res.redirect('https://angel.co/api/oauth/authorize?client_id=' + angelListClientId + '&scope=email&response_type=code');
}
exports.angelListCallback = function(req, res, next) {
  var token;
  var buf = '';
  var data;
  // console.log('/api/oauth/token?client_id=' + angelListClientId + '&client_secret=' + angelListClientSecret + '&code=' + req.query.code + '&grant_type=authorization_code');
  var angelReq = https.request({
    host: 'angel.co',
    path: '/api/oauth/token?client_id=' + angelListClientId + '&client_secret=' + angelListClientSecret + '&code=' + req.query.code + '&grant_type=authorization_code',
    port: 443,
    method: 'POST',
    headers: {
      'content-length': 0
    }
  }, function(angelRes) {
    angelRes.on('data', function(buffer) {
      buf += buffer;
    });
    angelRes.on('end', function() {
      try {
        data = JSON.parse(buf.toString('utf-8'));
      } catch (e) {
        if (e) return next(e);
      }
      if (!data || !data.access_token) return  next(new Error('No data from AngelList'));
      token = data.access_token;
      req.session.angelListAccessToken = token;
      if (token) {
        next();
      }
      else {
        next(new Error('No token from AngelList'));
      }
    });
  });
  angelReq.end();
  angelReq.on('error', function(e) {
    console.error(e);
    next(e);
  });
}
exports.angelListLogin = function(req, res, next) {
  var token = req.session.angelListAccessToken;
  httpsRequest = https.request({
      host: 'api.angel.co',
      path: '/1/me?access_token=' + token,
      port: 443,
      method: 'GET'
    },
    function(httpsResponse) {
      var userBuffer = '';
      httpsResponse.on('data', function(buffer) {
        userBuffer += buffer;
      });
      httpsResponse.on('end', function(){
        try {
          data = JSON.parse(userBuffer.toString('utf-8'));
        } catch (e) {
          if (e) return next(e);
        }
        if (data) {
          req.angelProfile = data;
          next();
        } else
          next(new Error('No data from AngelList'));
      });
    }
  );
  httpsRequest.end();
  httpsRequest.on('error', function(e) {
    console.error(e);
  });
};