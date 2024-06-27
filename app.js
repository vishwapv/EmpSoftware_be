// Initialize variables
require('events').EventEmitter.prototype._maxListeners = 20000;
// var mongoose = require('mongoose');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var responseTime = require('response-time');
const enableWs = require('express-ws');
// DB Config
var db = require("./config/keys");
var conn = require('./db/conn').getmongoConn(db.mongoURI);
var User = require("./models/User");
var config ="";

//basic auth
var basicAuth = require('express-basic-auth')


// Express Cache

var cache = require('express-redis-cache')({
    host: db.redisHost, //Redis Host
    port: db.redisPort //Redis Port
  });

//Router
// const users = require("./routes/api/users");
var router = require("./routes/index");

// Passport config
require("./config/passport")(passport, config, conn, User);

var app = express();

enableWs(app)


// Passport middleware
app.use(passport.initialize());
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

//Cors
//app.use(cors());
app.use(cors());
//app.options('*', cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  next();
});

app.use(responseTime());

// Routes
app.get("/", function(req, res){
    res.json({message: "Success!"});
});

router.addAPI("/api/v0", app, passport, cache);

// app.use("/api/users", users);


const port = process.env.PORT || 4008;

var server = app.listen(port, () => console.log(`Server up and running on port ${port} !`));
server.timeout = 999999;
