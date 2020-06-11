const express = require('express');

const Post = require('../model/post');

const router = express.Router();

router.post('',(req, res, next) => {
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

router.put('/edit/:id',(req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    console.log( result );
    res.status(200).json({ message: "Post Updated!"});
  });
});

router.get('/edit/:id',(req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  });
});

router.delete('/delete/:id',(req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(result =>{
    console.log(result);
    res.status(200).json({ massage: "Post Deleted!" });
  });
});

router.get('',(req, res, next) => {
  Post.find().then(documents =>  {
    res.status(200).json({
      message: "Post Fetch Successfuly",
      posts: documents
    });
  });
});

module.exports = router;
