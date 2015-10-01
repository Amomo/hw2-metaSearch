
var express = require('express');
var logger = require('morgan');
var path = require('path');
var routes = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.listen(3000, function(){
  console.log('listening on 3000...');
});