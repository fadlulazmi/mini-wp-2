const mongoose = require('mongoose')

let articleSchema = mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId, 
        ref : 'User'
    },
    title : {
        type: String,
        required: true
    },
    text : {
        type: String,
        required: true
    },
    date : {
        type: Date,
        required: true
    },
    img : {
        type: String,
        require: true
    },
    tags : [{
        type: String
    }],
    likes : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    status : {
        type: String,
        default: 'draft',
        require: true
    }
})

let Article = mongoose.model('Article', articleSchema)

module.exports = Article