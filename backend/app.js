const express = require('express');

const app = express();

app.use((req, res, next) => {                           //untuk memberikan akses nemampilkan DB
  res.setHeader( "Access-Control-Allow-Origin", "*" );  // * berarti semuanya
  res.setHeader(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept"    //beberapa tipe data yang bisa akses
    );
  res.setHeader(
    "Acces-Control-Allow-Methods",
    "GET, POST, DELETE, PATCH, OPTIONS"
    );
  next();
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
