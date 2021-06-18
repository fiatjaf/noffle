public/build/bundle.js: $(shell find src/)
	rollup -c

deploy: public/build/bundle.js
	netlify deploy --prod --dir=public/
