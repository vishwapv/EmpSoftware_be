const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const ActivityLogSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    event_type: {
        type: String,
        required: true
    },
    event_description:{
        type: String,
        required: true
    },
    event_design:{
        type: String,
        required: true
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
ActivityLogSchema.index({user_id:1});
module.exports = ActivityLog = mongoose.model("activitylog", ActivityLogSchema);