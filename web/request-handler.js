var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers');
var url = require('url');
var fs = require('fs');
// require more modules/folders here!

var sendResponse = function(response, statusCode, data, location) {
  if (location) {
    for (var key in location) {
      httpHelper.headers[key] = location[key];
    }
  }
  console.log(httpHelper.headers);
  statusCode = statusCode || 200;
  response.writeHead(statusCode, httpHelper.headers);
  response.end(data);
};

var sendFile = function(request, response, path, statusCode) {
  statusCode = statusCode || 200;
  fs.readFile(path, function(err, data) {
    if (err) {
      // console.log(path);
      throw err;
    } else {
      return sendResponse(response, statusCode, data);
    }
  });
};

var actions = {
  GET: function(request, response) {
    var pathName = url.parse(request.url).pathname;
    var newPath;

    if (pathName === '/') {
      newPath = path.join(archive.paths.siteAssets, '/index.html');
      sendFile(request, response, newPath);
    } else {
      archive.isURLArchived(pathName, function(exists) {
        if (exists) {
          newPath = path.join(archive.paths.archivedSites, pathName);
          sendFile(request, response, newPath);
        } else {
          newPath = path.join(archive.paths.siteAssets, '/loading.html');
          sendFile(request, response, newPath, 404);
        }
      });
    }
  },

  OPTION: function(request, response) {
    sendResponse(response);
  },

  POST: function(request, response) {
    var urlData = '';
    request.on('data', function(chunk){
      urlData += chunk;
    });
    request.on('end', function(){
      var url = urlData.split('=').pop();
      archive.isURLArchived(url, function(exists){
        if(!exists) {
          archive.addUrlToList(url, function() {
            url = path.join(archive.paths.siteAssets, '/loading.html');
            sendFile(request, response, url, 302);
          });
        } else {
          url = path.join(archive.paths.archivedSites, url);
          sendFile(request, response, url);
        }
      });
    });
  }
};

exports.handleRequest = function (request, response) {
  if (actions[request.method]) {
    actions[request.method](request, response);
  }
};
