var mongoose = require('mongoose');
var path = require('path');

var schema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        default: path.join(__dirname, '..','..','files'),
    },
    editor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});


mongoose.model('Video', schema);
