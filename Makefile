.PHONY: build

build:
	npm run build
	echo "/*    /index.html   200" > "build/_redirects"

deploy: build
	netlify deploy -d build

deploy-prod: build
	netlify deploy -d build --prod