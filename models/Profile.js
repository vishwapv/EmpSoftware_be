const mongoose = require("mongoose");
const Schema = mongoose.Schema;


// Create Schema
const ProfileSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  fullname: {
    type: String,
  },
  password: {
    type: String,
    min: 6
  },
  email: {
    type: String
  },
  profile_pic: {
    type: String
  },
  is_active: {
    type: Number,
    default: 0
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

ProfileSchema.index({user_id:1,email:1})
module.exports = Profile = mongoose.model("profile", ProfileSchema);