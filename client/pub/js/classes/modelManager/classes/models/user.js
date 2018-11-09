var mongoose = require('mongoose');
const fs = require("fs");
const path = require('path');//ez default 
const bcrypt = require(path.join(__dirname, '../../node_modules/bcyrpt', 'index.js'));


var contactObject = {emails:[String],phones:[String]};
var accessObject = {level:Number,group:[String]};

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  
  displayName:{
    type: String,
    required: true,
    default:'none'
  },

  password: {
    type: String,
    required: true,
  },

  token:{
    type: String,
    trim: true,
    default: null
  },
  access:{
    type:[accessObject],
    default: {level:0,group:[""]}
  },
  //a DIVISION  sema id tomb ??????????????
  //new mongoose.Types.ObjectId;
  //[Schema.Types.ObjectId],
  department:String,
  contact:contactObject,
  description:String,
  updated: { type: Date, default: Date.now },
  modDate:{ type: Date, default: Date.now,required: true},
  modUser:{ type: String, default:'None',required: true },

});


UserSchema.statics.authenticate = function (email, password, callback) {
  User.findOne({ email: email })
    .exec(function (err, user) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('User not found.');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function (err, result) {
        if (result === true) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    });
}

UserSchema.pre('save', function (next) {
  var user = this;
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  })
});


var User = mongoose.model('User', UserSchema);
module.exports = User;