var mongoose = require('mongoose');
var path = require('path');

var schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    editor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    theme: {
    	type: Boolean,
    	required: true,
    	default: false
    }
});

mongoose.model('Audio', schema);
