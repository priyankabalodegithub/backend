const mongoose=require('mongoose')
const templateSchema=new mongoose.Schema({
 template_created_for:{
    type:String,
    required:true
 },
 template_name:{
    type:String,
    required:true
 },
 template_message:{
    type:String,
    required:true
 },
 language:{
   type:String,
   required:true
},

document:{
   type:String,
  
},
image:{
   type:String,
},
doc_type:{
 type:String
},
is_send:{
   type:Number
}
  
});
module.exports=mongoose.model('Tbl_Template',templateSchema)

