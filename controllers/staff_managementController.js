
const Staff=require('../models/tbl_staff');
const Right=require('../models/tbl_rights');
const Permission=require('../models/staff_permission.')
const bcrypt=require('bcrypt');
const randomstring=require('randomstring');
const config=require("../config/config");
// const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');


// Add staff
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

// email exist
const emailExist=async(req,res)=>{

    try{
       
        Staff.find({email:req.query.email})
        .then(async resp=>{
         if(resp.length!=0){
           return res.status(200).send({success:false,msg:'Email alredy exist'})

        } else {
            return res.status(200).send({success:true,msg:'Email not exist'})
        }
      })

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// contact exist

const contactExist=async(req,res)=>{

    try{
       
        Staff.find({primary_contact_number:req.query.primary_contact_number})
        .then(async resp=>{
         if(resp.length!=0){
           return res.status(200).send({success:false,msg:'contact alredy exist'})

        } else {
            return res.status(200).send({success:true,msg:'contact not exist'})
        }
      })

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// tables rights
const rightList=async(req,res)=>
{
    try{

        const userData=await Right.aggregate([
            {
                $lookup:{
                    from:'tbl_modules',
                    localField:'module_id',
                    foreignField:'_id',
                    as:'module_id'
                }
            }
        ])
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }

}
// staff permission
const addPermission=async(req,res)=>{
    try{
        
            
            const permissionRight=new Permission({
                staff_id:req.body.staff_id,
                rights_id:req.body.rights_id,
                right_detail:req.body.right_detail,
                permission:req.body.permission  
                      
        })
            const userData=await permissionRight.save();

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
// staff list
const staffList=async(req,res)=>{
    try{
        var sortObject = {};
        var stype = req.query.sorttype ? req.query.sorttype : '_id';
        var sdir = req.query.sortdirection ? req.query.sortdirection : 1;
        sortObject[stype] = sdir;

        var search='';
        if(req.query.search){
            search=req.query.search
        }

        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 4;
        const result = {};
        const totalPosts = await Permission.countDocuments().exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        if (endIndex < (await Permission.countDocuments().exec())) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }
        result.data = await Permission.find()
        .populate('staff_id rights_id')
        .find({
            $or:[
                {first_name:{$regex:'.*'+search+'.*',$options:'i'}},
                {email:{$regex:'.*'+search+'.*',$options:'i'}},
                {primary_contact_number:{$regex:'.*'+search+'.*',$options:'i'}},
            ]
        })
        .sort(sortObject)
        .skip(startIndex)
        .limit(limit)
        .exec();
      result.rowsPerPage = limit;
      return res.send({ msg: "Posts Fetched successfully", data: result});

    }

    catch(error){
        console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
}

module.exports={
    
    addStaff,
    rightList,
    addPermission,
    staffList,
    // addRights,
    // rightList,
    // deletestaff,
    // editstaff,
    emailExist,
    contactExist
  
}

