var express = require('express');
var app = express();
var path = require('path');
var logger = require('morgan');
var fileUpload = require('express-fileupload');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.static('public'));

app.use(fileUpload());

app.get('/', function (req, res) {
  res.render('index.pug');
});

app.get('/contact-form', function (req, res) {
  res.render('contact-form.pug');
});

app.get('/contact', function (req, res) {
  res.send('TODO get all contacts');
});

app.post('/contact', function (req, res) {
  function formatDate(date) {
    return date.getYear() +
      date.getMonth() +
      date.getDate() +
      date.getHours() +
      date.getMinutes() +
      date.getSeconds() +
      date.getMilliseconds();
  }
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  var file = req.files.file;
  var ts = new Date();
  // Use the mv() method to place the file somewhere on your server
  file.mv(__dirname + '/images/' + formatDate(new Date()) + '.jpg', function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("uploaded");
    }
  });
  res.send('TODO post contact');
});

app.get('/contact/id', function (req, res) {
  res.send('TODO get contact of id');
});

app.put('/contact/id', function (req, res) {
  res.send('TODO put contact of id');
});

app.delete('/contact/id', function (req, res) {
  res.send('TODO delete contact of id');
});

app.listen(3000, function () {
  console.log("AppDdC prête");
});