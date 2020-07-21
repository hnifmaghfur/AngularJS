const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./routes/post');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb+srv://hanif:78fR9Y9MZi1f3pJc@database-xbatn.mongodb.net/database")
.then(() => {
  console.log('Connected to Database!');
})
.catch(() => {
  console.log('Connection Database Failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {                           //untuk memberikan akses nemampilkan DB
  res.setHeader( "Access-Control-Allow-Origin", "*" );  // * berarti semuanya
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"    //beberapa tipe data yang bisa akses
    );
  res.setHeader(
    "Access-Control-Allow-Methods",        //method yang dapat diterapkan
    "GET, POST, DELETE, PATCH, OPTIONS, PUT"
    );
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
