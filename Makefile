publish: 
	@npm publish --access public
test:
	@npm install
	@npm test
	@make coverage-report
coverage-report:
	@open coverage/lcov-report/index.html
