const mongoose = require("mongoose");
const con_url="mongodb://localhost:27017/myhandson"
function connectToMongo(){
    mongoose.connect(con_url,(err)=>{
        if(err){
            console.log("error "+err.message)
        }
        console.log("connected to Mongo...:-)");
    })
}
module.exports = connectToMongo;
