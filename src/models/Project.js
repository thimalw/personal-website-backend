const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Project = new Schema({
    title: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', Project);
