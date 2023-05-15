const Task = require('../models/tbl_taskManagement');
const TaskHistory = require('../models/task_history');
const Source=require('../models/tbl_contactSource');
const DealLost=require('../models/tbl_dealLostReason');
const Sales = require('../models/tbl_salesPhase');
const Action = require('../models/tbl_taskAction');
const Staff=require('../models/tbl_staff');

// contact source graph

const contactSourceGraph=async(req,res)=>{
    try{
        const sourceData =await Source.find();
        const allData = sourceData.map(async({_id, name}) => {
            const data =  await Task.find({contact_source: _id});

            return {
                name,
                count: data?.length
            }
        })
        Promise.all(allData).then((data) => {
            res.status(200).send({success:true,data:data});
        })
       

    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
}

// audiance behavior pattern graph

const audiencePattern=async(req,res)=>{
    try{
        const audienceData =await DealLost.find();
        const allData = audienceData.map(async({_id, dealLostReason}) => {
            const data =  await TaskHistory.find({reason_for_dealLost: dealLostReason});

            return {
                dealLostReason,
                count: data?.length
            }
        })
        Promise.all(allData).then((data) => {
            res.status(200).send({success:true,data:data});
        })
      

    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
}

// sales overview

const salesoverview=async(req,res)=>{
    try{
        const salesData =await Sales.find();
        const allData = salesData.map(async({_id, name}) => {
            const data =  await Task.find({sales_phase: _id});

            return {
                name,
                count: data?.length
            }
        })
        Promise.all(allData).then((data) => {
            res.status(200).send({success:true,data:data});
        })
      

    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
}

// task overview
const taskOverview=async(req,res)=>{
    try{
        const actionData =await Action.find();
        const allData = actionData.map(async({_id, action}) => {
            const New =  await TaskHistory.find({action: _id,task_status:1,is_completed:0});
            const progress =  await TaskHistory.find({action: _id,task_status:2,is_completed:0});
            const completed =  await TaskHistory.find({action: _id,task_status:3,is_completed:0,task_completed:1});

            return {
               New:{
                name:action,
                count: New?.length
                },
                Progress:{
                    name:action,
                    count:progress?.length
                },
                completed:{
                    name:action,
                    count:completed?.length

                },
                
            }
        })
        Promise.all(allData).then((data) => {
            res.status(200).send({success:true,data:data});
        })
      

    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
}
// lead conversion rate

const leadConversion=async(req,res)=>{
    try{
        const salesData =await Sales.find({name:"Win"});
        // const staffName=await Staff.find()
        const allData = salesData.map(async({_id, name}) => {
            const data =  await TaskHistory.find({sales_phase: _id,task_status:3,is_completed:0,task_completed:1});

            return {
                name,
                count: data?.length
            }
        })
        Promise.all(allData).then((data) => {
            res.status(200).send({success:true,data:data});
        })
        
       

    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
}

module.exports={
 contactSourceGraph,
 audiencePattern,
 salesoverview,
 taskOverview,
 leadConversion
   
}