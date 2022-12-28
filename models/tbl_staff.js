const mongoose=require('mongoose')
const staffSchema=new mongoose.Schema({
  
 first_name:{
    type:String,
    required:true
 },
 last_name:{
    type:String,
    required:true
 },

 designation:{
    type:String,
    required:true
 },
 
 primary_contact_number:{
    type:String,
    required:true
 },
 secondary_contact_number:{
    type:String,
   
 },
 email:{
    type:String,
    required:true
 },
 
type:{
   type:Number,
   default:1
}
  
});
module.exports=mongoose.model('Tbl_Staff',staffSchema)