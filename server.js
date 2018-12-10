'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
const dns = require('dns');
var cors = require('cors');
var bodyParser = require('body-parser');
var validUrl = require('valid-url');
var url = require('url');
var app = express();
//making static array and counter
var count = 0;
var dict = []; // create an empty array

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});

function isValid(url){
  if (validUrl.isUri(url)){
    //console.log('Looks like an URI');
    return true;
  } else {
    //console.log('Not a URI');
    return false;
  }
}

app.post("/api/shorturl/new/", function(req, res){
  //checking originalurl is valid or not
  var originalurl = req.body.url;
  //console.log(typeof(originalurl));
  if(isValid(originalurl)){
    dict.push(originalurl);
    count++;
    res.json({"original_url": originalurl,"short_url":count-1});
  }else{
    res.json({"error":"invalid URL"});
  }
});

app.get("/api/shorturl/:val", function(req,res){
  var i = parseInt(req.params.val);
  //console.log(req.params.val + " * " + count + " * " + i);
  if(i>=0 && i<count){
    //redirect to dist[req.params.val]
  //console.log(dict[i]);
    res.redirect(url.format(dict[i]));
    //  res.redirect(dict[i]);
  }
  else{
    //send error json 
    res.json({"error":"invalid URL h bsdk"});
  }
});
