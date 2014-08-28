var app = require ('../server').app,
  assert = require('assert'),
  request = require('superagent');

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var user1 = request.agent();
var port = 'http://localhost:'+app.get('port');
var userId;

var adminUser = {
  email: 'admin-test@test.com',
  password: 'admin-test'
};

suite('APPLICATION API', function (){
  suiteSetup(function(done){
    done();
  });
  test('log in as admin', function(done){
    user1.post(port+'/api/login').send(adminUser).end(function(res){
        assert.equal(res.status,200);
      done();
    });
  });
  test('get profile for admin',function(done){
    user1.get(port+'/api/profile').end(function(res){
        assert.equal(res.status,200);
      done();
    });
  });
  test('submit applicaton for user 3@3.com', function(done){
    user1.post(port+'/api/application').send({
        firstName: 'Dummy',
      lastName: 'Application',
      displayName: 'Dummy Application',
        password: '3',
        email: '3@3.com',
      headline: 'Dummy Appliation',
      photoUrl: '/img/user.png',
      angelList: {blah:'blah'},
      angelUrl: 'http://angel.co.com/someuser',
      twitterUrl: 'http://twitter.com/someuser',
      facebookUrl: 'http://facebook.com/someuser',
      linkedinUrl: 'http://linkedin.com/someuser',
      githubUrl: 'http://github.com/someuser'
    }).end(function(res){
      assert.equal(res.status,200);
      userId = res.body._id;
      done();
    });

  });
  test('logout admin',function(done){
    user1.post(port+'/api/logout').end(function(res){
        assert.equal(res.status,200);
      done();
    });
  });
  test('get profile again after logging out',function(done){
    user1.get(port+'/api/profile').end(function(res){
        assert.equal(res.status,500);
      done();
    });
  });
  test('log in as user3 - unapproved', function(done){
    user1.post(port+'/api/login').send({email:'3@3.com',password:'3'}).end(function(res){
        assert.equal(res.status,200);
      done();
    });
  });
  test('get user application', function(done){
    user1.get(port+'/api/application/').end(function(res){
      // console.log(res.body)
      assert.equal(res.status, 200);
      done();
    });
  });
  test('update user application', function(done){
    user1.put(port+'/api/application/').send({
      firstName: 'boo'}).end(function(res){
      // console.log(res.body)
      assert.equal(res.status, 200);
      done();
    });
  });
  test('get user application', function(done){
    user1.get(port+'/api/application/').end(function(res){
      // console.log(res.body)
      assert.equal(res.status, 200);
      done();
    });
  });
  test('check for posts - fail (unapproved?)', function(done){
    user1.get(port+'/api/posts/').end(function(res){
      // console.log(res.body)
      assert.equal(res.status, 500);

      done();
    });
  });
  test('logout user',function(done){
    user1.post(port+'/api/logout').end(function(res){
        assert.equal(res.status,200);
      done();
    });
  });
  test('log in as admin', function(done){
    user1.post(port+'/api/login').send(adminUser).end(function(res){
        assert.equal(res.status,200);
      done();
    });
  });
  test('delete user3', function(done){
    user1.del(port+'/api/users/'+userId).end(function(res){
      assert.equal(res.status, 200);
      done();
    });
  });
  test('logout admin',function(done){
    user1.post(port+'/api/logout').end(function(res){
        assert.equal(res.status,200);
      done();
    });
  });
  test('log in as user - should fail', function(done){
    user1.post(port+'/api/login').send({email:'3@3.com',password:'3'}).end(function(res){
      // console.log(res.body)
        assert.equal(res.status,500);

      done();
    });
  });
  test('check for posts - must fail', function(done){
    user1.get(port+'/api/posts/').end(function(res){
      // console.log(res.body)
      assert.equal(res.status, 500);

      done();
    });
  });
  suiteTeardown(function(done){
    done();
  });

});
