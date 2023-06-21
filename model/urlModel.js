const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const UrlSchema = new Schema({
    ObjectId,
    fullurl: {
        type: String,
        required: true,
        unique: true
    },
    newLink: {
        type: String,
        required: true,
        unique: true
    },
    clicks: {
        default: 0,
        type: Number,
        required: true
    }

})

const urlModel = mongoose.model('urlLinks', UrlSchema)
module.exports = urlModel;