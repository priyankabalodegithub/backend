const mongoose=require('mongoose')
const Staff=require('../models/tbl_staff');
const Right=require('../models/tbl_rights');
const bcrypt=require('bcrypt');
const randomstring=require('randomstring');
const config=require("../config/config");
// const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const Country=require('../models/country');
const State=require('../models/state');
const City=require('../models/city');
const { ObjectId } = require('mongodb');



const create_token=async(id)=>{
    try{
      
         const token=await jwt.sign({_id:id},config.sessionSecret);
         return token;


    }
    catch(error)
    {
        res.status(400).send(error.message);
    }
}


// Add group


const addStaff=async(req,res)=>{
    try{
            
            const staff=new Staff({
                first_name:req.body.first_name,
                last_name:req.body. last_name,
                designation:req.body.designation,
                primary_contact_number:req.body.primary_contact_number,     
                secondary_contact_number:req.body.secondary_contact_number,
                email:req.body.email
        })
            const userData=await staff.save();

            if(userData)
            {
               
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:"group data failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }

}



const addRights=async(req,res)=>{
    try{
        
            
            const right=new Right({
                staff_id:req.body.staff_id,
                rights:req.body,
              
                      
        })
            const userData=await right.save();

            if(userData)
            {
                
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:"group data failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }

}
// right list
const rightList=async(req,res)=>{
    try{

        var userlist=await Right.aggregate([
            {
            $lookup:
            {
                from : "tbl_staffs",
                localField:"staff_id",
                foreignField:"_id",
                as:"staff_id"
            }
        }])
        console.log(JSON.stringify(userlist));

    res.status(200).send({success:true,data:userlist});

    }
    catch(err){
        console.log(err);
        res.status(400).send(err.message);
    }

    
}
// delete staff
    
const deletestaff=async(req,res)=>{
    try{

        const id=req.query.id;
        await Right.deleteOne({_id:id});
    res.status(200).send({success:true,msg:"Staff can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}
const editstaff=async(req,res)=>{
    try{
        
       
       const id=req.query.id;
       const userData=await Right.findById({_id:id});

       if(userData){
        const rights=await Right.find({_id:id}).populate('staff_id')
        res.status(200).send({success:true,group:rights})

       }

       else{
       
        res.status(200).send({success:false})
       }

    }
    catch(error){
        res.status(400).send(error.message);
    }
}


module.exports={
    create_token,
    addStaff,
    addRights,
    rightList,
    deletestaff,
    editstaff
  
}

