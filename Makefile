# REPORTER = dot
REPORTER = list
# MOCHA_OPTS = --ui tdd 
MOCHA_OPTS = --ui tdd --ignore-leaks
# 
# 
# 
# main:
#   @NODE_ENV=test ./node_modules/mocha/.bin/mocha \
#     --reporter $(REPORTER) \
# 	tests/test.js; @echo main test;
# 
# test-w:
#   @NODE_ENV=test ./node_modules/mocha/.bin/mocha \
#     --reporter $(REPORTER) \
#     --growl \
#     --watch

test: 
	clear
	echo Starting test *********************************************************
	./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	tests/*.js
	echo Ending test

test-w: 
	./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	--growl \
	--watch \
	$(MOCHA_OPTS) \
	tests/*.js 

users: 
	mocha tests/users.js --ui tdd --reporter list --ignore-leaks
	
posts: 
	clear
	echo Starting test *********************************************************
	./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	tests/posts.js 
	echo Ending test

application: 
	mocha tests/application.js --ui tdd --reporter list --ignore-leaks
	
.PHONY: test test-w posts application