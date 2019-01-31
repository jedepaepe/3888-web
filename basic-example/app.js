var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.get('/', function(req, res, next) {
  res.render('index.pug');
});

app.listen(3000, function() {
  console.log("AppDdC prête");
});