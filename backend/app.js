const express = require('express');

const app = express();

app.use((req, res, next) => {
  console.log( 'Tes menggunakan express' );
  next();
});

app.use((req, res, next) => {
  res.end( 'Berhasil Tes App' );
});

module.exports = app;
