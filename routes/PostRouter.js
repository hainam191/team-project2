var express = require('express');
var router = express.Router();
var PostService = require("../services/PostService");
var jwt = require("jsonwebtoken");
require("./UserRouter")
router.get("/data",function(req, res, next){
    PostService.getAll().then(function(data){
      res.json(data)
    })
})
router.get("/page/:currentPage", function (req, res, next) {
  var currentPage = +req.params.currentPage;
  PostService.page(currentPage).then(function (data) {
      res.json(data)
  })
})

router.put("/:id",
// function(req,res,next){
//   var token = req.cookies.token;
//   var deCode = jwt.verify(token,process.env.TOKEN);
//   PostService.findIdPost(deCode._id).then(function(code){
//     if (code.length<1) {
//       return res.json("You need a valid token ID")
//     }
//     next();
//   })
// },
async function(req, res, next){
    var id = req.params.id;
    try {
      await PostService.findID(id);
      next();
    } catch (error) {
      if (error.name === 'CastError') {
        return res.json("Invalid ID")
      }
    }
},function(req, res, next){
    var id = req.params.id;
    var title = req.body.title;
    var content = req.body.content;
    var author = req.body.author;
    PostService.updateID(id,title,content,author).then(function(data){
      // console.log(deCode);
     return res.json({
        message: "Cập nhật thành công"
      })
    })
})
router.delete("/delete/:id",
// function(req,res,next){
//   var token = req.cookies.token;
//   var deCodeDel = jwt.verify(token,process.env.TOKEN);
//   console.log(deCodeDel);
//   PostService.findIdPost(deCodeDel.id).then(function(data){
//     console.log(data);
//     if (data.length<1) {
//       return res.json("You need a valid token ID")
//     }
//     next();
//   })
// },
async function(req, res, next){
    try {
      await PostService.findID(req.params.id);
      next();
    } catch (error) {
      if (error.name === 'CastError') {
        return res.json("Invalid ID")
      }
    }
} ,function (req, res, next) {
  var id = req.params.id;
  PostService.deleteId(id).then(function (data) {
      res.json("Xóa thành công")
  })
})

router.post("/create-post",function(req,res,next){
  var title = req.body.title;
  var content = req.body.content;
  var author = req.body.author;
  PostService.goPost(title,content,author).then(function(data){
      res.json("Thêm bài thành công")
  })
})

module.exports = router;
