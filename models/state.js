const mongoose=require('mongoose')
const stateSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    country_short_name:{
        type:String,
        required:true
    }
 
});
module.exports=mongoose.model('Tbl_State',stateSchema)