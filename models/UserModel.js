var mongoose = require("../config/db")
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: String,
    password: String,
    gmail: String,
    isActive: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: 'user'
    }
},{
    collection: "user"
})

var UserModel = mongoose.model("user",UserSchema);
module.exports = UserModel;