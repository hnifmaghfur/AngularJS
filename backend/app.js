const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./model/post');
const app = express();

mongoose.connect('mongodb+srv://hanif:78fR9Y9MZi1f3pJc@database-xbatn.mongodb.net/database?retryWrites=true&w=majority', { useNewUrlParser: true })
.then(() => {
  console.log('Connected to Database!');
})
.catch(() => {
  console.log('Connection Database Failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {                           //untuk memberikan akses nemampilkan DB
  res.setHeader( "Access-Control-Allow-Origin", "*" );  // * berarti semuanya
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"    //beberapa tipe data yang bisa akses
    );
  res.setHeader(
    "Access-Control-Allow-Methods",        //method yang dapat diterapkan
    "GET, POST, DELETE, PATCH, OPTIONS"
    );
  next();
});

app.post('/api/posts',(req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  console.log( post );
  post.save().then(result => {
    res.status(201).json({
      messange: 'Post added successfully',
      postId: result._id
    });

  });

});

app.delete('/api/posts/delete/:id',(req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result =>{
    console.log(result);
    res.status(200).json({ massage: "Post Deleted!" });
  });
});

app.use('/api/posts',(req, res, next) => {
  Post.find().then(documents =>  {
    res.status(200).json({
      posts: documents
    });
  })
});

module.exports = app;
