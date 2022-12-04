const express = require("express");
const connectToMongo = require("./db");
const authRouter = require("./routes/auth");
const app = express();

app.use(express.json());
connectToMongo();
app.use("/api/users",authRouter);
app.get("/",(req,res)=>{
    res.send("<h1>Welcome to My Web App</h1>");
});
app.listen(9000,()=>{
    console.log("server listening on 9090");
})