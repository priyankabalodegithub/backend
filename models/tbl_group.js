const mongoose=require('mongoose')
const groupSchema=new mongoose.Schema({
 group_name:{
    type:String,
    required:true
 },
 group_description:{
    type:String,
    required:true
 },
 
 status:{
   type:Boolean,
   required:true
},

// colors:{
//    type:Array,
//    required:true
// },
// country:{
//    type:Array,
//    required:true
// },

is_group:{
   type:Number,
   default:1
}
  
});
module.exports=mongoose.model('Tbl_Group',groupSchema)

