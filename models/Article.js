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
    image: String,
    isFav: {
        type: Boolean,
        default: false
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comments'
    }]
})

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;

