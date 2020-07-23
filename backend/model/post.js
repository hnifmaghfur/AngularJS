const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema ({
  title: { type: String, required: true },
  content: { type: String, require: true },
  imagePath: { type: String, require: true},

  //creator untuk mengambil ID (pengguna yang bikin post) pada setiap post
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

module.exports = mongoose.model('Post', postSchema);  //nama modelnya Post
