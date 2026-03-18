.PHONY: submodules submodule-private status

submodules:
	git submodule update --init --recursive --remote

submodule-private:
	git submodule update --init --remote private

status:
	git status --short --branch
	git submodule status