//var https = require('https');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require("request");

module.exports = function(data, res) {

  var list = [];
  var keywords = encodeURIComponent(data.keywords);

  function series(callbacks, last) {
    function next() {
      var callback = callbacks.shift();
      if (callback) {
        callback(function() {
          next();
        });
      } else { last(); }
    }
    next();
  }

  function final(results) {
    res.status(200).json(list);
  }

  series([
    function(next) {
      g_search(keywords, next);
     },
    function(next) {
      y_search(keywords, next);
    },
    function(next) {
      b_search(keywords, next);
    },
    function(next) {
      read('g_result.json', next);
    },
    function(next) {
      read('y_result.json', next);
    },
    function(next) {
      read('b_result.json', next);
    }
  ], final );

  function read(filename, cb) {
    var file = __dirname + '/../' + filename;
    fs.readFile(file, 'utf8', function(err, data) {
      var result = JSON.parse(data);
      list.push(result);
    });
    setTimeout(function() { cb(filename); }, 500);
  }

};

function g_search(key, cb) {
  var target = "https://www.google.com/search?gws_rd=cr&hl=en&q=" + key;

  request({
      url: target,
      method: "GET"
  }, function(err, res, body) {
    if (err || !body) { return; }
    var $ = cheerio.load(body);
    var result = [];
    var g_search = $(".g");
    for (var i = 0; i < g_search.length; i++) {
    var tmp_title = $(g_search[i]).find('.r').text();
    var tmp_url = $(g_search[i]).find('.r a').attr('href');
    var tmp_des = $(g_search[i]).find('.st').text();

      if (tmp_url.search("/url?") === 0) {
        var slice_no = tmp_url.indexOf("&sa=U");
        tmp_url = tmp_url.slice(7, slice_no);

        result.push({ "title": tmp_title, "url": tmp_url, "description": tmp_des });
      }
    }
    fs.writeFileSync("g_result.json", JSON.stringify(result));
  });
  
  setTimeout(function() { cb(key); }, 500);
}
function y_search(key, cb) {
  var target = "https://search.yahoo.com/search?q=" + key;

  request({
    url: target,
    method: "GET"
  }, function(err, res, body) {
    if (err || !body) { return; }
      var $ = cheerio.load(body);
      var result = [];
      var y_search = $(".algo");
      for (var i = 0; i < y_search.length; i++) {
        var tmp_title = $(y_search[i]).find('.title').text();
        var tmp_url = $(y_search[i]).find('.title a').attr('href');
        var tmp_des = $(y_search[i]).find('.compText').text();
        result.push({ "title": tmp_title, "url": tmp_url, "description": tmp_des });
      }
      fs.writeFileSync("y_result.json", JSON.stringify(result));
    });

    setTimeout(function() { cb(key); }, 500);
}
function b_search(key, cb) {
  var target = "https://www.bing.com/search?q=" + key;

  request({
    url: target,
    method: "GET"
  }, function(err, res, body) {
    if (err || !body) { return; }
      var $ = cheerio.load(body);
      var result = [];
      var b_search = $(".b_algo");
      for (var i = 0; i < b_search.length; i++) {
        var tmp_title = $(b_search[i]).find('a').text();
        var tmp_url = $(b_search[i]).find('a').attr('href');
        var tmp_des = $(b_search[i]).find('p').text();
        result.push({ "title": tmp_title, "url": tmp_url, "description": tmp_des });
      }
      fs.writeFileSync("b_result.json", JSON.stringify(result));
    });
    setTimeout(function() { cb(key); }, 500);
}