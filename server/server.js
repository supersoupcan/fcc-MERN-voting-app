const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

const auth = require('./routes/auth');
const polls = require('./routes/polls')

const authConfig = require('../config/auth.config');
const database = require('../config/database.config');
const User = require('../models/user');

// CREATE APP  //
var app = express();

//  CONNECT TO DATABASE  //
mongoose.connect(database.url, {
  useMongoClient: true
}); 

//  MIDDLEWARE //
app.use(express.static(path.join(__dirname, '../client')));
app.use(bodyParser.urlencoded({
  extended : false
}));

app.use(bodyParser.json());

app.use(session({
  secret: 'what a heck of a life',
  store : new MongoStore({ 
    mongooseConnection: mongoose.connection,
  }),
  resave: true,
  saveUninitialized: true,
}));

//  PASSPORT CONFIG  //
app.use(passport.initialize());
app.use(passport.session());

   
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new FacebookStrategy(authConfig.facebook,
  function(token, tokenSecret, profile, cb){
    User.findOne({facebookID : profile.id}, function(err, user){
      if (err){
        return cb(err);
      } else if (user){
        return cb(null, user);
      } else {
        var newUser = new User();
        newUser.facebookID = profile.id
        newUser.token = token;
        newUser.displayName = profile.displayName;
        newUser.save(function(err){
          if (err) throw err;
          return cb(null, newUser);
        })
      }
    })
}));

//  API  //

app.use('/auth', auth(passport));
app.use('/polls', polls);

app.get('/user/:id/*', function(req, res, next){
  if (req.hasOwnProperty('user')){
    if(req.user.facebookID === req.params.id){
      next();
    }else{
      res.redirect('/');
    }
  }
  else if(!req.hasOwnProperty('user')){
    res.redirect('/');
  }
});


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
});

//  SERVE API //
module.exports = app;