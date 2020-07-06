const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema ({
  title: { type: String, required: true },
  content: { type: String, require: true },
  imagePath: { type: String, require: true}
});

module.exports = mongoose.model('Post', postSchema);  //nama modelnya Post
