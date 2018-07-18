const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    summary: String,
    link: {
        type: String,
        required: true
    },
    isFav: {
        type: Boolean,
        default: false
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
})

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;

