var PostModel = require("../models/PostModel");

function getAll(){
    return PostModel.find();
}

function goPost(title, content, author) {
    return PostModel.create({
        title: title,
        content: content,
        author: author
    })
}

function updateID(id,title,content,author){
    var info = {}
    if(title){
        info.title = title
    }
    if(content){
        info.content = content
    }
    if(author){
        info.author = author
    }
    return PostModel.updateMany({
        _id : id
    },info
)}
function findID(id){
    return PostModel.findById({
        _id:id
    })
}
function findIdPost(id){
    return PostModel.find({
        _id:id
    })
}
function deleteId(id){
    return PostModel.deleteMany({
        _id:id
    })
}
function page(currentPage,dataPerPage){
    return PostModel.find().skip((currentPage-1)*6).limit(6)
}

module.exports = {
    getAll,
    goPost,
    page,
    updateID,
    deleteId,
    findID,
    findIdPost
}