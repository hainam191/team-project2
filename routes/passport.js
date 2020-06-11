var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var UserModel = require("../models/UserModel");
const bcrypt = require('bcrypt');
// const saltRounds = 10;
var isPassport = ()=>{
    passport.use(new LocalStrategy({usernameField:"email",passwordField:"password"},
  function(email, password, done) {
    UserModel.findOne({ email: email}, function (err, user) {
      if (!user) {
        return done(null, false)
      }
      console.log(user);
      bcrypt.compare(password,user.password, function(err, result) {
        if (err){ 
          return done(err); 
        }
        if (!result) {
          return done(null, false);
        }
        return done(null, user);
    });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  UserModel.findById(id, function(err, user) {
    done(err, user);
  });
});
    return passport;
}
module.exports = isPassport;