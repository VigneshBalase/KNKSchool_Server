const mongoose = require('mongoose')


const BlogSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    baseimage: {
        type: String,
        required: true,
    },
    head: {
        type: String,
        required: false,
    },
    description: { 
        type: String,
        required: true,
    },
});

const BlogModel = mongoose.model('Blogs', BlogSchema);

module.exports = BlogModel;