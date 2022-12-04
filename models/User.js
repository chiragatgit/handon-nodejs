const mongoose = require("mongoose");
const {Schema} = mongoose;

let UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true 
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
let UserModel = mongoose.model("UserModel",UserSchema);
module.exports = UserModel;