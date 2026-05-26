.PHONY: status build

status:
	git status --short --branch

build:
	npm run build