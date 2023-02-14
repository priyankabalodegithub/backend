const mongoose=require('mongoose')
const allcontactSchema=new mongoose.Schema({
    group_id:{
        type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Group',
        //  required:true
     },
     contact_id:[{
        type:mongoose.Schema.Types.ObjectId,ref:'Tbl_ContactManagement',
     }]

  
});
module.exports=mongoose.model('Tbl_AllGroupMembers',allcontactSchema)