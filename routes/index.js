var fs = require('fs');
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var search = require('../lib/search');
var parseUrlencoded = bodyParser.urlencoded({ extended: false });

router.get('/', function(req, res, next) {
});

router.post('/search', parseUrlencoded, function(req, res, next) {
  console.log(req.body);
  search(req.body , res);
});

module.exports = router;
