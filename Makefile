REPORTER = list
MOCHA_OPTS = --ui tdd

test:
	clear
	echo Seeding *********************************************************
	node seed.js
	echo Starting test *********************************************************
	foreman run ./node_modules/mocha/bin/mocha \
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
	clear
	echo Starting test *********************************************************
	foreman run ./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	tests/users.js
	echo Ending test

posts:
	clear
	echo Starting test *********************************************************
	foreman run ./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	tests/posts.js
	echo Ending test

application:
	clear
	echo Starting test *********************************************************
	foreman run ./node_modules/mocha/bin/mocha \
	--reporter $(REPORTER) \
	$(MOCHA_OPTS) \
	tests/application.js
	echo Ending test

.PHONY: test test-w posts application