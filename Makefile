deploy:
	npm run build
	netlify deploy -d build

deploy-prod:
	npm run build
	netlify deploy -d build --prod