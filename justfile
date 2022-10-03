kata := ''

default: check-and-fix

check-and-fix: typecheck test lint

test:
	npx jest {{kata}}

typecheck:
	npx tsc --noEmit

lint:
	npx eslint .

