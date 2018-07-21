const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author:  {
        type: String
    },
    content: {
        type: String
    }
  
});

const Comments = mongoose.model('Comments', CommentSchema);

module.exports = Comments;