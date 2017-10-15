var mongoose = require('mongoose');

var pollSchema = mongoose.Schema({
  date : {type: Date, default: Date.now},
  title : String,
  allowCustom : Boolean,
  author : {
    displayName : String,
    facebookID : String
  },
  options : [{
    label : String,
    votes : [{
      facebookID : String
    }]
  }]
})

module.exports = mongoose.model('Poll', pollSchema);