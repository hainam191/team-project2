var UserModel = require("../models/UserModel");

function signin(email,password,gmail){
    return UserModel.create({
        email: email,
        password: password,
        gmail: gmail
    })
}
function updateVerify(id){
    return UserModel.updateOne({
        _id:id,
    },{ isActive: true})
}

function findByUser(email){
    return UserModel.find({
        email: email
    });
}
function findId(id){
    return UserModel.find({
        _id:id
    })
}
function findPassport(email){
    return UserModel.findOne({
        email:email
    })
}
function admin(id){
    return UserModel.find({
        _id:id
    })
}

module.exports = {
    signin,
    findByUser,
    findId,
    findPassport,
    admin,
    updateVerify
}