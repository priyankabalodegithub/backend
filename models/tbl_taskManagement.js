const mongoose=require('mongoose')
const taskManagementSchema=new mongoose.Schema({
  
subject:{
    type:String
 },
 add_task_for:{
    type:String
 },
 set_task_priority:{
    type:String
 },
 reason_to_change_task_priority:{
    type:String
 },
 estimated_date:{
    type:Date
 },
 reason_to_change_estimated_date:{
    type:String
 },
 contact_source:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tbl_ContactSource'       
 },
 selected_list:{
    type:String
 },
 business_opportunity:[{
    type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Business_Opportunity',
     required:true
 }],
 sales_phase:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tbl_SalesPhase'       
 },
 action:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Tbl_TaskAction'       
 },
 action_date:{
    type:Date
 },
 remarks:{
    type:String
 },
 assign_task_to:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Staff_Permission'

 }

}
 
);
module.exports=mongoose.model('Tbl_TaskManagement',taskManagementSchema)