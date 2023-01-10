
const Source=require('../models/tbl_contactSource');
const Sales=require('../models/tbl_salesPhase');
const Action=require('../models/tbl_taskAction');
const Task=require('../models/tbl_taskManagement');

// add contact source
const contactSource=async(req,res)=>{
    try{
            
            const source=new Source({
                name:req.body.name,         
                
        })
            const userData=await source.save();

            if(userData)
            {
                
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:"data failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }
}


// contact source list

const sourceList=async(req,res)=>{
    try{

        const userData=await Source.find();
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// add sales phase
const salesPhase=async(req,res)=>{
    try{
            
            const sales=new Sales({
                name:req.body.name,         
                
        })
            const userData=await sales.save();

            if(userData)
            {
                
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:"data failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }
}


// sales phase list

const salesList=async(req,res)=>{
    try{

        const userData=await Sales.find();
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// add action
const addAction=async(req,res)=>{
    try{
            
            const action=new Action({
                action:req.body.action,         
                
        })
            const userData=await action.save();

            if(userData)
            {
                
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:"data failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }
}


// action list

const actionList=async(req,res)=>{
    try{

        const userData=await Action.find();
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}


// Add task

const addTask=async(req,res)=>{
    try{
            
            const task=new Task({
                subject:req.body.subject,
                add_task_for:req.body.add_task_for,
                set_task_priority:req.body.set_task_priority,
                reason_to_change_task_priority:req.body.reason_to_change_task_priority,
                estimated_date:req.body.estimated_date,
                reason_to_change_estimated_date:req.body.reason_to_change_estimated_date,
                contact_source:req.body.contact_source,
                selected_list:req.body.selected_list,
                business_opportunity:req.body.business_opportunity,
                sales_phase:req.body.sales_phase,
                action:req.body.action,
                action_date:req.body.action_date,
                remarks:req.body.remarks,
                assign_task_to:req.body.assign_task_to,  
                
        })
            const userData=await task.save();

            if(userData)
            {
                
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:"contact data failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }

}

module.exports={
    contactSource,
    sourceList,
    salesPhase,
    salesList,
    addAction,
    actionList,
    addTask 
}

