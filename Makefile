public/build/bundle.js: $(shell find src/)
	./node_modules/.bin/rollup -c

deploy: public/build/bundle.js
	netlify deploy --prod --dir=public/
