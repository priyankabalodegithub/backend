const mongoose=require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/CRMSETUP")

const express=require("express");
const app=express();



app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type,Accept");
    next();
})

const cors=require('cors');
app.use(cors({
}))

// for admin router
const adminRoute=require('./routes/adminRoutes')
app.use('/api',adminRoute);

// for user router
// const userRoute=require('./routers/userRoute')
// app.use('/api',userRoute);




app.listen(5000,function(){
    console.log("server is running")
})
