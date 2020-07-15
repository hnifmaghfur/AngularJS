const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //ini package tambahan dari mongoose, install sendiri

const Schema = mongoose.Schema;

const userSchema = new Schema ({
  email: { type: String, required: true, unique: true },
  password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator); //digunakan untuk membuat email hanya 1 yang sama

module.exports = mongoose.model('User', userSchema);  //nama modelnya User
