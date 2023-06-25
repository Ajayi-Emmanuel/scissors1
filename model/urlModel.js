const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UrlSchema = new Schema({
    fullurl: {
        type: String,
        required: true
    },
    newLink: {
        type: String,
        required: true,
        unique: true
    },
    src: {
        type: String, 
        required: true
    },
    clicks: {
        default: 0,
        type: Number 
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }

})

const urlModel = mongoose.model('urlLinks', UrlSchema)
module.exports = urlModel; 