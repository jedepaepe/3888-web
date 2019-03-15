/**
 *  utilise MongoDB avec la structure suivante
 *  database : hr
 *       collection : ddc
 */

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
  // récupère la date courante
  var now = moment();
  // récupère les raisons
  var reasons = getReasons();
  // pug-engine "convertir" le ddc-form.pug en HTML
  res.render('ddc-form.pug', {
    title: 'nvl DdC',
    created: now.format('YYYY-MM-DD'),              // par ex => 2019-02-21
    start: now.add(1, 'days').format('YYYY-MM-DD'), // par ex => 2019-02-22
    end: now.add(2, 'days').format('YYYY-MM-DD'),   // par ex => 2019-02-23
    reasons: reasons
  });
});

// traite le formulaire
app.post('/ddc', function(req, res) {
  // récupère un objet pour manipuler la collection 'ddc' de la db 'hr' de MongoDB
  var ddcCollection = dbhr.collection('ddc');
  // insérer un document dans la collection, (fonction asynchrone avec callback)
  ddcCollection.insertOne(req.body, function(err, result) {
    if(err) { // s'il y a une erreur
      console.log(err);   // enregistrer pour le développeur/administrateur du site
      res.status(500);    // mettre le HTTP status code à 500 = server internal error
      res.send('error');  // renvoyer un message à l'utilisateur
    } else {  // il n'y a pas d'erreur (cela veut que le document a été enregistré dans la DB)
      res.status(201);    // mettre le HTTP status code à 201 = created
      res.send('saved in db');  // renvoyer un message à l'utilisateur
    }
  });
});

// retourne une demande de congés particulière
// app.get('/ddc/:id', function(req, res) {

// retourne la liste des demandes de congés en format JSON
app.get('/ddc', function(req, res) {
  // récupère un objet pour manipuler la collection 'ddc' de la db 'hr' de MongoDB
  var ddcCollection = dbhr.collection('ddc');
  // find - trouve tous les documents de la collection ddc
  ddcCollection.find().toArray(function(err, result) {
    if(err) {
      console.log(err);
      res.status(500);
      res.send('error');
    }
    res.status(200);  // HTTP status 200 : OK
    res.send(result); // renvoie le résultat du ddcCollection.find().toArray = l'ensemble des documents dans la collection ddc (sous format json)
  });
});

// modifie une demande de congé
// HTTP PUT ddc/quelque_chose => req.param.id = quelque_chose
// HTTP PUT ddc/0290xAad900 => req.param.id = 0290xAad900
app.put('/ddc/:id', function(req, res) {
  // récupère un objet pour manipuler la collection 'ddc' de la db 'hr' de MongoDB
  var ddcCollection = dbhr.collection('ddc');
  // demande à MongoDB de mettre à jour le document
  ddcCollection.updateOne(
    {_id: new mongodb.ObjectId(req.params.id)}, // crée un MongoDB ObjectId
    {$set: req.body},       // le document "modifié" à sauver dans MongoDB
    function(err, result) { // callback exécutée lorsque MongoDB aura exécuté le updateOne
      if(err) {
        console.log(err);
        res.status(500);
        res.send('error');
      }
      console.log(result);
      res.status(200);
      res.send();
    }
  );
});

// suppression d'une demande de congés
// voir put (pour :id)
app.delete('/ddc/:id', function(req, res) {
  var ddcCollection = dbhr.collection('ddc');
  ddcCollection.deleteOne(
    {_id: new mongodb.ObjectId(req.params.id)},   // MongoDB object id
    function(err, result) {   // callback exécutée lorsque le deleteOne est terminé
      if(err) {
        console.log(err);
        res.status(500);
        res.send('error');
      }
      console.log(result);
      res.status(200);
      res.send();
    }
  );
});


// charge MongoDB
var dbhr;  // connexion à la DB hr de MongoDB
var mongodb = require('mongodb');   // chargement de la librairie MongoDB
// vous connectez la DB
mongodb.MongoClient.connect('mongodb://localhost:27017/', function(err, client) {
  if(err) {
    console.log(err);
    return;
  }
  // récupère un objet MongoDB database pour manipuler la database 'hr'
  dbhr = client.db('hr');

  // démarre le web server
  app.listen(3000, function() {
    console.log(moment());
    console.log("AppDdC démarré");
  });
});
