// 1. chargement des librairies

// 1.1. chargement des librairies externes (récupérer "npm install" et installer dans nodes_modules)

// "require('http-errors')" charge la librairie "http-error" et
// retourne une référence vers la librairies 'http-errors' et 
// assigne cette référence à la variable 'createError'
var createError = require('http-errors');

// "require('express') charge la librairie "express" et 
// retourne une référence vers cette librairie et 
// assigne cette référence à la variable "express"
var express = require('express');

// idem pour librairie "path"
var path = require('path');

// idem pour librairie "cookie-parser"
var cookieParser = require('cookie-parser');

// idem pour librairie "morgan"
var logger = require('morgan');

// 1.2 chargement du "librairies" locales
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// 2. la fonction express() construit un objet
//    retourne la référence sur l'objet
//    qui est sauvée dans la variable app
var app = express();

// 3. dire à app (l'application express) quel view-engine utiliser
//    view = vue : c'est que voit le client/utilisateur
//      client = browser
//      view-engine construite la réponse (response) envoyée au brower

// où sont les vues (views)
//    rem: path.join(__dirname, 'views') retourne
//            ./views sous Linux
//            .\views sous Windows
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
