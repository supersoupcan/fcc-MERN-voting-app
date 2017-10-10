var express = require('express')
var router = express.Router();

var mongoose = require('mongoose');
var Poll = require('../../models/poll');

router.post('/vote', function(req, res){
  Poll.findOne({_id : req.body.id}, function(err, doc){
    if (err) throw err;
    doc.options[req.body.index].votes.push({ 
      facebookID : req.user.facebookID
    });
    doc.save(function(err, done){
      if (err) throw err;
      res.redirect('/user/' + req.user.facebookID)
    });
  })
})

router.post('/create', function(req, res){
  var newPoll = new Poll();
  newPoll.title = req.body.title;
  newPoll.author = {
    displayName : req.user.displayName,
    facebookID : req.user.facebookID,
  }
  req.body.options.map(function(item, index){
    var option = {
      label : item,
      votes : 
        index === req.body.firstVote ? 
        [{facebookID : req.user.facebookID}] : []
    }
    newPoll.options[index] = option;
    newPoll.save(function(err){
      if (err) throw err;
    })
  })
  res.redirect('/user/' + req.user.facebookID);
})

router.get('/list', function(req, res){
  Poll.find({}, function(err, poll){
    if (err) throw err;
    res.json(poll);
  })
})


module.exports = router;