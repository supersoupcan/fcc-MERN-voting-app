module.exports = (passport) => {
  var express = require('express');
  var router = express.Router();
  
  router.get('/facebook', 
    passport.authenticate('facebook')
  );
    
  router.get('/facebook/cb', 
    passport.authenticate('facebook', { failureRedirect: '/'}),
    function(req, res){
      res.redirect('/user/' + req.user.facebookID);
    }
  )
  
  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
  
  return router;
}