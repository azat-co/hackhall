var app = require('../server').app,
	assert = require('assert'),
	request = require('superagent');
// http = require('support/http');

var user1 = request.agent();
var port = 'http://localhost:' + app.get('port');


app.listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});

suite('Test root', function() {
	setup(function(done) {
		console.log('setup');

		done();
	});

	test('check /', function(done) {
		request.get('http://localhost:3000').end(function(res) {
			assert.equal(res.status, 200);
			done();
		});
	});
	test('check /api/profile', function(done) {
		request.get('http://localhost:' + app.get('port') + '/api/profile').end(function(res) {
			assert.equal(res.status, 500);
			done();
		});
	});
	test('check /api/users', function(done) {
		user1.get('http://localhost:' + app.get('port') + '/api/users').end(function(res) {
			assert.equal(res.status, 500);
			// console.log(res.text.length);
			done();
		});
		// done();
	});
	test('check /api/posts', function(done) {
		user1.get('http://localhost:' + app.get('port') + '/api/posts').end(function(res) {
			assert.equal(res.status, 500);
			// console.log(res.text.length);
			done();
		});
		// done();
	});
	teardown(function(done) {
		console.log('teardown');
		done();
	});

});

suite('Test log in', function() {
	setup(function(done) {
		console.log('setup');

		done();
	});
	test('login', function(done) {
		user1.post('http://localhost:3000/api/login').send({
			email: '1@1.com',
			password: '1'
		}).end(function(res) {
			assert.equal(res.status, 200);
			done();
		});

	});
	test('check /api/profile', function(done) {
		user1.get('http://localhost:' + app.get('port') + '/api/profile').end(function(res) {
			assert.equal(res.status, 200);
			// console.log(res.text.length);
			done();
		});
		// done();
	});
	test('check /api/users', function(done) {
		user1.get('http://localhost:' + app.get('port') + '/api/users').end(function(res) {
			assert.equal(res.status, 200);
			// console.log(res.text);
			done();
		});
		// done();
	});
	test('check /api/posts', function(done) {
		user1.get('http://localhost:' + app.get('port') + '/api/posts').end(function(res) {
			assert.equal(res.status, 200);
			// console.log(res.text.length);
			done();
		});
		// done();
	});

	teardown(function(done) {
		console.log('teardown');
		done();
	});

});
suite('User control', function() {
	var user2 = {
		firstName: "Bob",
		lastName: "Dilan",
		displayName: "Bob Dilan",
		email: "2@2.com"
	};
	suiteSetup(function(done) {
		user1.post('http://localhost:3000/api/login').send({
			email: '1@1.com',
			password: '1'
		}).end(function(res) {
			assert.equal(res.status, 200);
			// done();
		});
		user1.get('http://localhost:' + app.get('port') + '/api/profile').end(function(res) {
			assert.equal(res.status, 200);
			// console.log(res.text.length);
			// done();
		});

		done();
	})

	test('new user POST /api/users', function(done) {
		user1.post(port + '/api/users')
			.send(user2)
			.end(function(res) {
				assert.equal(res.status, 200);
				// console.log(res.text.length);
				user2 = res.body;
				// console.log(user2)
				done();
			})
	});
	test('get user list and check for new user GET /api/users', function(done) {
		user1.get('http://localhost:' + app.get('port') + '/api/users').end(function(res) {
			assert.equal(res.status, 200);
			// console.log(res.body)
			var user3 = res.body.filter(function(el, i, list) {
				return (el._id == user2._id);
			});
			assert(user3.length === 1);
			// assert(res.body.indexOf(user2)>-1);
			// console.log(res.body.length)
			done();
		})
	});
	test('Approve User: PUT /api/users/' + user2._id, function(done) {
		assert(user2._id != '');
		user1.put(port + '/api/users/' + user2._id)
			.send({
				approved: true
			})
			.end(function(res) {
				assert.equal(res.status, 200);
				// console.log(res.text.length);
				assert(res.body.approved);
				user1.get(port + '/api/users/' + user2._id).end(function(res) {
					assert(res.status, 200);
					assert(res.body.approved);
					done();
				})

			})
	});
	test('Banned User: PUT /api/users/' + user2._id, function(done) {
		assert(user2._id != '');
		user1.put(port + '/api/users/' + user2._id)
			.send({
				banned: true
			})
			.end(function(res) {
				assert.equal(res.status, 200);
				// console.log(res.text.length);
				assert(res.body.banned);
				user1.get(port + '/api/users/' + user2._id).end(function(res) {
					assert(res.status, 200);
					assert(res.body.banned);
					done();
				})

			})
	});
	test('Promote User: PUT /api/users/' + user2._id, function(done) {
		assert(user2._id != '');
		user1.put(port + '/api/users/' + user2._id)
			.send({
				admin: true
			})
			.end(function(res) {
				assert.equal(res.status, 200);
				// console.log(res.text.length);
				assert(res.body.admin);
				user1.get(port + '/api/users/' + user2._id).end(function(res) {
					assert(res.status, 200);
					assert(res.body.admin);
					done();
				})

			})
	});
	test('Delete User: DELETE /api/users/:id', function(done) {
		assert(user2._id != '');
		user1.del(port + '/api/users/' + user2._id)
			.end(function(res) {
				assert.equal(res.status, 200);
				// console.log('id:' + user2._id)
				user1.get(port + '/api/users').end(function(res) {
					assert.equal(res.status, 200);
					var user3 = res.body.filter(function(el, i, list) {
						return (el._id === user2._id);
					});
					// console.log('***');
					// console.warn(user3);
					assert(user3.length === 0);
					done();
				});
			});


	});
});
// app.close();		
// console.log(app)