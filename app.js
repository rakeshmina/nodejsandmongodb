var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var assert = require('assert');
var fs = require('fs');

// Connection URL
const url = "mongodb://localhost:27017";
 
// Database Name
const dbName = 'myproject';

var ejs = require('ejs');

var app = express();

var urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('view engine','ejs');

app.use('/gywspublic',express.static('gywspublic'));

app.get('/form',function(req,res){
    console.log('Got request on /form');
    res.render('index');
});


 
app.post('/submit',urlencodedParser, function(req,res){
    mongo.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true },function(err,client){
    assert.equal(null,err);
    console.log('connected to mongodb database');
    
    const db = client.db(dbName);
    const collection = db.collection('documents');
    collection.insertMany([
        {username : req.body.name}, 
        {contactemail : req.body.email},
        {contactnumber : req.body.number},
        {file:req.body.file}
      ], function(err, result) {
        assert.equal(err, null);
        assert.equal(4, result.result.n);
        assert.equal(4, result.ops.length);
        console.log("Inserted 4 documents into the collection");
      });
      
      client.close();
    });
    console.log('posted');
    res.send('submitted');
    //res.redirect('/submit');
});

//app.post('/submit',something.uploadFile);

app.listen(3000);
console.log('SomeOne is listening to 3000 port!');