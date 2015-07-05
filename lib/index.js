var consolidate = require('consolidate');
var _ = require('lodash');
var path = require('path');
var Promise = require('bluebird');

module.exports = {
	applyTemplates: applyTemplates
}

function applyTemplates(options) {
	var options = applyDefaults(options);
	return applyTemplatesToFile;

	function applyTemplatesToFile(file) {
		// find the templates that should be used for this file
		var templates = undefined;
		if (file.templates)
			templates = file.templates;
		if (file.template)
			templates = [file.template];

		// no templates means no rendering needed
		if (!templates)
			return file;

		// template names to file paths
		templates = templates.map(function(templateName) {
			return path.join(options.directory, templateName + '.' + options.extension);
		});

		// render using all the templates sequentially
		return templates.reduce(function(filePromise, template) {
			return filePromise.then(function(f) {
				return renderFileWithTemplate(f, template);
			});
		}, Promise.resolve(file));
	}

	function renderFileWithTemplate(file, template) {
		return consolidate[options.engine](template, file).then(function(newContents) {
			return _.extend(file, {contents: newContents});
		});
	}
}

function applyDefaults(options) {
	if (!options.engine) {
		throw new Error("Please provide the 'engine' option (what template engine should be used).");
	}
	if (!options.directory) {
		throw new Error("Please provide the 'directory' option (what directory the templates reside in).");
	}
	if (!options.extension) {
		throw new Error("Please provide the 'extension' option (what extension your template files have).");
	}

	return _.defaults(options || {}, {
	});
}
