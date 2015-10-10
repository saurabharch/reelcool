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
    }
});

mongoose.model('Video', schema);
