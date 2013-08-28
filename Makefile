INTEGRATION_TESTS?=$(shell find test -path test/integration/tests/*.js)
REPORTER?=spec
MOCHA_OPTS=--reporter $(REPORTER) \
					 --profile-base $(PWD)/profile.js \
					 $(INTEGRATION_TESTS)

.PHONY: default
default: lint test

# This target is listed as phony because although it generates a directory
# named `node_modules`, the directory's presence does not indicate that the
# dependencies are fully satisfied and up-to-date.
.PHONY: node_modules
node_modules:
	npm install

b2g:
	./node_modules/.bin/mozilla-download --verbose --product b2g $@

.PHONY: lint
lint:
	gjslint  --recurse . \
		--disable "220,225" \
		--exclude_directories "b2g,examples,node_modules"

.PHONY: integration-test-sync
integration-test-sync:
	SYNC=true ./node_modules/.bin/marionette-mocha $(MOCHA_OPTS)

.PHONY: integration-test-async
integration-test-async:
	./node_modules/.bin/marionette-mocha $(MOCHA_OPTS)

.PHONY: integration-test
integration-test: integration-test-sync integration-test-async

.PHONY: test
test: b2g node_modules integration-test
