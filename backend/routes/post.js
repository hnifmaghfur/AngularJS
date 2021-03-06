const express = require('express');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const Post = require('../model/post');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpeg' : 'jpg',
  'image/jpg' : 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invald mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

//checkAuth digunakan untuk mengenkripsi jalur(route)
//multer digunakan untuk mengambil data fhoto
router.post('', checkAuth, multer({storage: storage}).single("image") ,(req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      messange: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  });
});

router.put('/edit/:id', checkAuth, multer({storage: storage}).single("image") ,(req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
    console.log(result);
    if(result.nModified > 0) {
      res.status(200).json({ message: "Post Updated!"});
    } else {
      res.status(401).json({ message: "Not Authorized!"});
    }
  });
});

router.get('/edit/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  });
});

router.delete('/delete/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result =>{
    console.log(result);
    if(result.n > 0){
      res.status(200).json({ massage: "Post Deleted!" });
    } else {
      res.status(401).json({ message: "Not Authorized"});
    }
  });
});

//ini adalah jalur untuk tampilan awal
router.get('',(req, res, next) => {
  const pageSize = +req.query.pagesize;     // + digunakan untuk mengubah nilai menjadi number only.
  const currentPage = +req.query.page;
  const postQuery = Post.find();2
  let fetchPosts;
  if (pageSize && currentPage){
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery.then(documents =>  {
    fetchPosts = documents;
    return Post.count();                  //untuk menghitung jumlah data yang masuk.
  }).then(count => {
    res.status(200).json({
      message: "Post Fetch Successfuly",
      posts: fetchPosts,
      maxPosts: count
    });
  }
  );
});

module.exports = router;
