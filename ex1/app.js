// Express in Action
// Evan M. Hahn
// page 91

var express = require("express");
var logger = require("morgan");

var app = express();

app.use(logger('dev'));

// API logger
app.get("/random/:min/:max", function(req, res) {
  var min = parseInt(req.params.min);
  var max = parseInt(req.params.max);

  if(isNaN(min) || isNaN(max)) {
    res.status(400);
    res.json({error: "Bad request"});
    return;
  }
  
  var result = Math.round(Math.random() * (max - min) + min);
  res.json({result: result});
});

// favicon https://stackoverflow.com/questions/15463199/how-to-set-custom-favicon-in-express
 //const fs = require('fs'); 
 //const favicon = fs.readFileSync(__dirname+'/public/favicon.ico'); // read file
 const favicon = new Buffer('AAABAAEAEBAQAAAAAAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEREQAAAAAAEAAAEAAAAAEAAAABAAAAEAAAAAAQAAAQAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAEAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAA//8AAP//AAD8HwAA++8AAPf3AADv+wAA7/sAAP//AAD//wAA+98AAP//AAD//wAA//8AAP//AAD//wAA', 'base64'); 
 app.get("/favicon.ico", function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Length', favicon.length);
  res.setHeader('Content-Type', 'image/x-icon');
  res.setHeader("Cache-Control", "public, max-age=2592000");                // expiers after a month
  res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
  res.end(favicon);
 });

  
app.listen(3000, function() {
  console.log("Random API app started");
});
