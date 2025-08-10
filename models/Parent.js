const mongoose = require('mongoose');

const parentSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true,
    },

    phone : {
        type: String,
        required: true,
    },

    nic : {
        type : String,
        required: true,
        unique: true,
    },

    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
} ,{ timestamps: true });

module.exports = mongoose.model('Parent', parentSchema);