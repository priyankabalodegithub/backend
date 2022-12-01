const mongoose=require('mongoose')
const rightSchema=new mongoose.Schema({
  
staff_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tbl_Staff'
 },
 rights:{
    type:Array,
    required:true,  
      
 }
},
 
);
module.exports=mongoose.model('Tbl_Right',rightSchema)