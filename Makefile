deploy:
	npm run build
	netlify deploy -d build

deploy-prod:
	netlify deploy --prod