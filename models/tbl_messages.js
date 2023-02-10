const mongoose=require('mongoose')
const messageSchema=new mongoose.Schema({
    message:{
       type:String,
       
    },
    language:{
       type:String,
    },
   
    template_name:{
       type:String,
      //  required:true
    },
    
    template_id:[{
      type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Template',
      //  required:true
   }],
    
    group_id:[{
      type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Group',
      //  required:true
   }],
    
   is_send:{
      type:Number,
      default:0
   },
   when_to_send:{
    type:String,
   
 },
 contact_count:{
   type:Number,
   default:0

 },
 members:[{
   type:mongoose.Schema.Types.ObjectId,ref:'Tbl_ContactManagement',

 }],
 date_time:{
   type:Date,
   default:new Date()
 }
     
   });
   module.exports=mongoose.model('Tbl_Message',messageSchema)