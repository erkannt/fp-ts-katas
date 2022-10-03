.PHONY: test

.DEFAULT_GOAL := check-and-fix

node_modules: package.json package-lock.json
	npm install

check-and-fix: typecheck test fix

test: node_modules
	npx jest

typecheck: node_modules
	npx tsc --noEmit

lint: node_modules
	npx eslint .

