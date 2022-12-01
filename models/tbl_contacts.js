const mongoose=require('mongoose')
const contactSchema=new mongoose.Schema({
  
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
 company_name:{
    type:String,
    required:true
 },
 primary_contact_number:{
    type:Number,
    required:true
 },
 secondary_contact_number:{
    type:Number,
   
 },
 email:{
    type:String,
    required:true
 },
  group:[{
    type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Group',
 }],
  status:{
    type:Boolean,
    required:true
 },
 address1:{
    type:String,
    required:true
 },
 address2:{
    type:String,
    required:true
 },
 taluka:{
    type:String,
    required:true
 },
 village:{
    type:String,
    required:true
 },
 zipcode:{
    type:String,
    required:true
 },
 
 city: {
   type:String
},
state:{
   type:String
},
country:{
   type:String
},
 
type:{
   type:Number,
   default:1
}
  
});
module.exports=mongoose.model('Tbl_Contact',contactSchema)