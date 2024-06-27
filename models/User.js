const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  email:{
    type:String,
    required:true
  },
  password:{
    type: String,
    required:true
  },

  //if isActive 
  // => 0 -> means not verified
  // => 1 -> means account verified
  // => 2 -> means account blocked
  //3 => 3 -> means account deleted
  
  is_active: {
    type: Number,
    default: 0
  },
  profiles: {
    type: Array
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }

});

UserSchema.index({mobile:1,is_active:1})
module.exports = User = mongoose.model("users", UserSchema);