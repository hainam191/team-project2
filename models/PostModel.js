var mongoose = require("../config/db")
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: String,
    content: String,
    author: String,
},{
    collection: "posts"
})

var PostModel = mongoose.model("posts",PostSchema);
module.exports = PostModel;