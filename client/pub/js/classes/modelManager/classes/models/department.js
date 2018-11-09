var mongoose = require('mongoose');
const fs = require("fs");
const path = require('path');//ez default 
const bcrypt = require(path.join(__dirname, '../../node_modules/bcyrpt', 'index.js'));

var contactObject = {emails:[String],phones:[String]};
var DepartmentSchema = new mongoose.Schema({
  
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  
  displayName:{
    type: String,
    required: true
  },

  contact:contactObject,
  description:String,
  updated: { type: Date, default: Date.now },
  modDate:{ type: Date, default: Date.now,required: true},
  modUser:{ type: String, default:'Admin',required: true }

});

var Department = mongoose.model('Department', DepartmentSchema);
module.exports = Department;