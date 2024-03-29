var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    var urls = data.split('\n');
    callback(urls);
  });
};

exports.isUrlInList = function(){

};

exports.addUrlToList = function(url, callback){
  var listPath = exports.paths.list;
  // fs.readFileSync(listPath, 'utf8', function(err, data) {
  //   // console.log(err);
  //   console.log(typeof data);
  // });
  // console.log(listPath)

  fs.appendFile(listPath, url + '\n', function(err) {
    callback();
  });
};

exports.isURLArchived = function(pathName, callback){
  fs.exists(path.join(exports.paths.archivedSites, pathName), function (exists) {
    callback(exists);
  });
};

exports.httpify = function(link) {
  if (link.search(/^http[s]?\:\/\//) === -1) {
    link = 'http://' + link;
  }
  return link;
};

exports.downloadUrl = function(url) {
  var httpUrl = exports.httpify(url);
  http.get(httpUrl, function(res) {
    var data = '';
    res.on('data', function(chunk) {
      data += chunk;
    });
    res.on('end', function() {
      fs.open(exports.paths.archivedSites + '/' + url, 'w', function(err, fd) {
      fs.writeFileSync(exports.paths.archivedSites + '/' + url, data);
      });
    });
  });
};



exports.downloadUrls = function(){
  exports.readListOfUrls(function(urls) {
    _.each(urls, function(url) {
      exports.isURLArchived(url, function(exists) {
        if (!exists) {
          exports.downloadUrl(url);
        }
      })
    })
  });
};
