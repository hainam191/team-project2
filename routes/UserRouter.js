var express = require('express');
var router = express.Router();
var UserService = require("../services/UserService");
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require("jsonwebtoken");
var passport = require("passport");
var sendMail = require("./contact");

router.get("/signin", function (req, res, next) {
    res.render("signin")
})
router.get("/login", function (req, res, next) {
    res.render("login")
})
router.get('/logout', function(req, res){
    res.clearCookie("token");
    req.logOut();
    res.redirect('/user/login');
});
router.get("/private",function(req,res,next){
    var token = req.cookies.token;
    try {
        var deCode = jwt.verify(token,process.env.TOKEN);
        UserService.admin(deCode.id).then(function(data){
            if (data.length >= 1 && data[0].role=="admin") {
                next()
            } else {
                return res.render("data")
            }
        })
    } catch (err) {
        console.log(err,"err");
              if (err.message=='invalid signature') {
                  return res.json("Mã token không đúng")
              } 
              if (err.message=='jwt must be provided') {
                return res.json("Vui lòng nhập mã token")
            } 
            if (err.message=='jwt expired') {
                return res.json("Mã token hết hạn")
            } 
            if (err.message=='invalid token') {
                return res.json("Mã token sai")
            } 
               return res.json("Lỗi hệ thống")
           }
},function(req,res,next){
    res.render("private")
  })
router.post("/signin",function(req, res, next){
    var email = req.body.email;
    UserService.findByUser(email).then(function(data){
        if (data) {
            next();
        } else {
            return res.json({
                error: true,
                message: "Tài khoản đã tồn tại"
            })
        }
    })
}  ,function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var gmail = req.body.gmail;
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            UserService.findByUser(email).then(function (data) {
                if (data.length >= 1) {
                    res.json({
                        error: true,
                        message: "Tài khoản đã tồn tại"
                    })
                } else {
                    UserService.signin(email, hash,gmail).then(async function (data) {
                        var token = jwt.sign({_id:data._id }, process.env.TOKEN_EMAIL,{expiresIn:5*60*1000})
                        var to = req.body.gmail;
                        var subject = "Verify Account";
                        var html = `<a href="http://localhost:3000/user/active/${token}">Click to verify</a>
                        `
                        await sendMail(to,subject,html)
                        res.json({
                            error: false,
                            message: "Đăng kí thành công"
                        })
                    })
                }
            })
        });
    });
})

router.get('/active/:token',function(req, res, next){
    var token = req.params.token;
    try {
        var deCode = jwt.verify(token,process.env.TOKEN_EMAIL);
        UserService.updateVerify(deCode._id).then(function(data){
            res.redirect("/user/login")
        })
    } catch (err) {
        if (err.message=='invalid signature') {
            return res.json("Mã token không đúng")
        } 
        if (err.message=='jwt must be provided') {
          return res.json("Vui lòng nhập mã token")
      } 
      if (err.message=='jwt expired') {
          return res.json("Mã token hết hạn,hãy đăng kí lại tài khoản và xác nhận ngay")
      } 
      if (err.message=='invalid token') {
          return res.json("Mã token sai")
      } 
         return res.json("Lỗi hệ thống")
    }
})

router.get('/sendBackMail/:id',async function(req, res, next){
    var id = req.params.id;
    var user = await UserService.findId(id);
    var token = jwt.sign({_id:user._id },process.env.TOKEN_EMAIL,{expiresIn:5*1000*60});
    var subject = "Verify Account";
                        var html = `<a href="http://localhost:3000/user/active/${token}">Click to verify</a>
                        `
                    sendMail(subject,html)
                    res.redirect("/user/login")   
})
router.post('/login', function (req, res, next) {
    passport.authenticate('local', { successRedirect: '/user/private',
                                    failureRedirect: '/user/login' }, (err, user, info) => {
        if (err || !user) {
            return res.json({
                message: 'Bạn nhập sai tài khoản hoặc mật khẩu',
                user: user
            });
        }
       req.login(user, {session: false}, (err) => {
           if (err) {
                return res.json({
                message: "Bạn nhập sai tài khoản hoặc mật khẩu"
               });
           };
            var token = jwt.sign({ id: user._id }, process.env.TOKEN,{expiresIn:"2d"})
                // res.cookie("token",token,{maxAge:1000*60*60*24})
           return res.json({
                message: "Bạn đã đăng nhập thành công",
                token:token
           });
        });
    })(req, res);
});
module.exports = router;
