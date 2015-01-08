var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers');
var url = require('url');
var fs = require('fs');
// require more modules/folders here!

var sendResponse = function(response, statusCode, data) {
  statusCode = statusCode || 200;
  response.writeHead(statusCode, httpHelper.headers);
  response.end(data);
};

var actions = {
  GET: function(request, response, fixturePath) {
    fixturePath = fixturePath || '/index.html';
    fs.readFile(archive.paths.siteAssets + fixturePath,  function(err, data) {
      if (err) {
        console.log('error')
        throw err;
      }
      return sendResponse(response, 200, data);
    });
  }
};

exports.handleRequest = function (request, response) {
  // var parts = url.parse(request.url);
  // console.log(parts);
  // parts.pathname;
  // response.write(200, httpHelper.headers);
  if (actions[request.method]) {
    actions[request.method](request, response);
  }
};
