const secret_sign = "Y0ur$ecretG0e$Here";
const jsonwebtoken = require("jsonwebtoken");

const getuser = (req,res,next)=>{
    let authToken = req.header("auth-token");
    if(!authToken){ // token not found in header
        return res.status(400).json({"success":false,"message":"Not a valid token"});
    }
    try {
        // otherwise verify and generate a payload from token
        let mPayload = jsonwebtoken.verify(authToken,secret_sign);
        // payload has user object
        req.user = mPayload.user;
        // calling next middlewear in chain
        next();
    } catch (error) {
        return res.status(401).json({"success":false,"message":"User has not a valid token"})
    }   
}
module.exports = getuser;