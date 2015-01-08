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

var sendDefault = function(request, response, path) {
  fs.readFile(path, function(err, data) {
    if (err) {
      console.log('error');
      throw err;
    } else {
      return sendResponse(response, 200, data);
    }
  });
};

var actions = {
  GET: function(request, response) {
    var pathName = url.parse(request.url).pathname;
    var newPath;

    if (pathName === '/') {
      newPath = path.join(archive.paths.siteAssets, '/index.html');
      sendDefault(request, response, newPath);
    } else {
      newPath = path.join(archive.paths.archivedSites, pathName);
      sendDefault(request, response, newPath);
    }
  },

  OPTION: function(request, response) {
    sendResponse(response);
  },

  POST: function(request, response) {
    var urlData = '';
    console.log('inpost');
    request.on('data', function(chunk){
      urlData += chunk;
    });
    request.on('end', function(){
      var url = urlData.split('=').pop();
      archive.isURLArchived(url, function(exists){
        if(exists) {
          return; //do stuff
        }
      });
      // var url = JSON.parse(urlData);
      // sendResponse(response, 304);
    });
  }
};

exports.handleRequest = function (request, response) {
  if (actions[request.method]) {
    actions[request.method](request, response);
  }
};
