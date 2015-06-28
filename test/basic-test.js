var path = require('path');
var assert = require('assert');
var cheerio = require('cheerio');

describe("applyTemplates()", function() {

	var applyTemplates = require('../').applyTemplates({
		engine: 'mote', 
		directory: path.join(__dirname, 'test-templates'),
		extension: 'html'
	});

	it("should handle a single template properly", function(done) {
		var file = {contents: "Hello.", template: "wrap-in-div"};
		applyTemplates(file).then(function(result) {
			assert.equal(result.contents, "<div>Hello.</div>");
		}).then(done).catch(done);
	});

	it("should render multiple templates sequentially", function(done) {
		var file = {contents: "Hello.", title: "Greetings", templates: ["wrap-in-div", "master"]};
		applyTemplates(file).then(function(result) {
			assert.equal(result.title, "Greetings");

			var $ = cheerio.load(result.contents);
			assert.equal($('title').text(), "Greetings");
			assert.equal($('body > div').text(), "Hello.");
		}).then(done).catch(done);
	});
});