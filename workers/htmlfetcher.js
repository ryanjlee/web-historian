// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var archive = require('../helpers/archive-helpers');
var http = require('http');
var httpRequest = require('http-request');

var archivedSites = archive.paths.archivedSites;
var list = archive.paths.list;

// http.get('http://www.google.com/index.html', function(res) {
//   console.log(res);
// })
//
var httpify = function(link) {
    if (link.search(/^http[s]?\:\/\//) == -1) {
        link = 'http://' + link;
    }
    return link;
};

var url = httpify('www.google.com')

http.get(url, function(res) {
  var data = '';
  res.on('data', function(chunk) {
    data += chunk;
  });
  res.on('end', function() {
    console.log(data)
  });
});
