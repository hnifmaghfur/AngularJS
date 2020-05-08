const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./model/post');
const app = express();

mongoose.connect('mongodb+srv://hanif:Nifinda7@dbangular-oj9z7.mongodb.net/database?retryWrites=true&w=majority', { useNewUrlParser: true })
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
    "Acces-Control-Allow-Methods",        //method yang dapat diterapkan
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
  post.save();
  res.status(201).json({
    messange: 'Post added successfully'
  });
});

app.use('/api/posts',(req, res, next) => {
  const posts = [
    { id: 'h123qklwe',
      title: 'Belajar Angular',
      content: 'Ini adalah Post Pertama'
    },
    { id: 'h1253441qklwe',
      title: 'Belajar Node JS',
      content: 'Ini adalah Post Kedua'
    }
  ];

  return res.status(200).json({
    messange: 'Berhasil input Post',
    posts: posts
  });
});

module.exports = app;
