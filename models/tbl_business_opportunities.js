const mongoose=require('mongoose')
const business_opportunitySchema=new mongoose.Schema({
 title:{
    type:String,
    required:true
 },
 
 is_active:{
   type:Boolean,
   required:true
},

type:{
   type:Number,
   default:1
}
  
});
module.exports=mongoose.model('Tbl_Business_Opportunity',business_opportunitySchema)