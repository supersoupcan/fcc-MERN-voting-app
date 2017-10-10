var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  facebookID : String,
  token : String,
  displayName : String,
})

module.exports = mongoose.model('User', userSchema);