// charge le framework express
var express = require("express");
var app = express();

// charge le logger (écrit sur la console)
var logger = require("morgan");
app.use(logger('dev'));

// charge la librairie Moment.js (gestion du temps)
var moment = require('moment');

// charge la librairie path (/\)
var path = require('path');

// indique où se trouve les views
app.set('views', path.join(__dirname, 'views'));

// charge pug view engine (render)
app.set('view engine', 'pug');

// pour les paramètres
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// pour les fichiers statiques
app.use(express.static('public'));

// construit un flavison dans la mémoire, https://stackoverflow.com/questions/15463199/how-to-set-custom-favicon-in-express
const favicon = new Buffer('AAABAAEAEBAQAAAAAAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEREQAAAAAAEAAAEAAAAAEAAAABAAAAEAAAAAAQAAAQAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAA//8AAP//AAD8HwAA++8AAPf3AADv+wAA7/sAAP//AAD//wAA+98AAP//AAD//wAA//8AAP//AAD//wAA', 'base64'); 

// retourne le flavicon
app.get("/favicon.ico", function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Length', favicon.length);
  res.setHeader('Content-Type', 'image/x-icon');
  res.setHeader("Cache-Control", "public, max-age=2592000");                // expiers after a month
  res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
  res.end(favicon);
 });

 // retourne la "home" page
app.get("/", function(req, res) {
  res.render('index', {title: 'DdC'})
})

function getReasons() {
  // TODO
  // allez chercher les raisons dans MongoDB
  return [
    'congé annuel',
    'congé éducation',
    'congé de paternité',
    'congé de maternité'
  ];
}

 // retourne le formulaire
app.get("/ddc-form", function(req, res) {
  var now = moment();
  var reasons = getReasons();
  res.render('ddc-form.pug', {
    title: 'nvl DdC',
    created: now.format('YYYY-MM-DD'),
    begin: now.add(1, 'days').format('YYYY-MM-DD'),
    start: now.add(2, 'days').format('YYYY-MM-DD'),
    reasons: reasons
  });
});

// traite le formulaire
app.post('/ddc', function(req, res) {
  console.log(JSON.stringify(req.body));
  dbhr.collection('ddc').insertOne(req.body, function(err, result) {
    console.log('insertOne result: ' + JSON.stringify(result));
    if(err) {
      console.log(err);
      res.status(500);
      res.send('error');
    }
    res.status(201);
    res.send('saved in db');
  });
});

// affiche la liste des demandes de congés
app.get('/ddc', function(req, res) {
  dbhr.collection('ddc').find().toArray(function(err, result) {
    if(err) {
      console.log(err);
      res.status(500);
      res.send('error');
    }
    res.status(400);
    res.send(result);
  });
});

app.put('/ddc/:id', function(req, res) {
  db.collection('ddc').updateOne({_id: new mongodb.ObjectId(req.params.id)}, {$set: req.body}, function(err, result) {
    if(err) {
      console.log(err);
      res.status(500);
      res.send('error');
    }
    console.log(result);
    res.startus(400);
    res.send();
  });
});

app.delete('/ddc/:id', function(req, res) {
  dbhr.collection('ddc').deleteOne({_id: new mongodb.ObjectId(req.params.id)}, function(err, result) {
    if(err) {
      console.log(err);
      res.status(500);
      res.send('error');
    }
    console.log(result);
    res.status(200);
    res.send();
  });
});

// charge MongoDB
var dbhr;  // connexion à la DB hr de MongoDB
var mongodb = require('mongodb');   // chargement de la librairie MongoDB
var MongoClient = mongodb.MongoClient;  // driver client MongoDB
// vous connectez la DB
MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
  if(err) {
    console.log(err);
    return;
  }
  dbhr = client.db('hr');
  app.listen(3000, function() {
    console.log(moment());
    console.log("AppDdC démarré");
  });
});




