var app = require('../server').app,
  assert = require('assert'),
  request = require('superagent');

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

var user1 = request.agent();
var port = 'http://localhost:' + app.get('port');
var postId;

var adminUser = {
  email: 'admin-test@test.com',
  password: 'admin-test'
};

suite('POSTS API', function() {
  suiteSetup(function(done) {
    done();
  });
  test('log in', function(done) {
    user1
      .post(port + '/api/login')
      .send(adminUser)
      .end(function(res) {
        assert.equal(res.status, 200);
        done();
      }
    );
  });
  test('add post', function(done) {
    user1.post(port + '/api/posts').send({
      title: 'Yo Test Title',
      text: 'Yo Test text',
      url: ''
    }).end(function(res) {
      assert.equal(res.status, 200);
      postId = res.body._id;
      done();
    });

  });
  test('get profile', function(done) {
    user1.get(port + '/api/profile').end(function(res) {
      assert.equal(res.status, 200);
      done();
    });
  });
  test('post get', function(done) {
    // console.log('000'+postId);
    user1.get(port + '/api/posts/' + postId).end(function(res) {
      assert.equal(res.status, 200);
      assert.equal(res.body._id, postId);
      done();
    });
  });
  test('delete post', function(done) {
    user1.del(port + '/api/posts/' + postId).end(function(res) {
      assert.equal(res.status, 200);
      done();
    });
  });
  test('check for deleted post', function(done) {
    user1
      .get(port + '/api/posts/' + postId)
      .end(function(res) {
        assert.equal(res.status, 500);
        done();
      }
    );
  });
  suiteTeardown(function(done) {
    done();
  });

});