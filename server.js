'use strict';

var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var session = require('express-session');
var logger = require("morgan");
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var flash = require('connect-flash');

var app = express();
require('dotenv').load();

mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGO_URI);
mongoose.Promise = global.Promise;

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'secretStockMarketNow',
	resave: false,
	saveUninitialized: true
}));

//http headers on console
app.use(logger("dev")); // probar tambien con "combined"
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(cookieParser());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('views', '/app/views');
app.set('view engine', 'pug');

// SETIING UP CLIENT SIDE
app.use('/bootstrap/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/bootstrap/js/jquery', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/bootstrap/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/bootstrap/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts')); // redirect CSS bootstrap


// Data to send to Routes files
var appEnv = {
  path: process.cwd()
}

routes(app, appEnv);

var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
