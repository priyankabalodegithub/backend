
const Group=require('../models/tbl_group');
const randomstring=require('randomstring');
const config=require("../config/config");
// const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const Country=require('../models/country');
const State=require('../models/state');
const City=require('../models/city')

const getCountries=async(req,res)=>{
    try{
        const countries=await Country.find({})
        res.status(200).send(countries)
    }
    catch(error){
        res.status(400).send({msg:error.message})
    }
}

const getStates=async(req,res)=>{
    try{
        const states=await State.find({country_short_name:req.body.country_short_name})
        res.status(200).send(states)
    }
    catch(error){
        res.status(400).send({msg:error.message})
    }
}

const getCities=async(req,res)=>{
    try{
        const cities=await City.find({state_name:req.body.state_name})
        res.status(200).send(cities)
    }
    catch(error){
        res.status(400).send({msg:error.message})
    }
}


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


const addGroup=async(req,res)=>{
    try{
            
            const group=new Group({
                group_name:req.body.group_name,
                group_description:req.body. group_description,
                status:req.body.status,
                // colors:req.body,
                country:req.body      
                
        })
            const userData=await group.save();

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

// group total
const grouptotal=async(req,res)=>
{
    try{

        const userData=await Group.find({ is_group:1});
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }

}

// group list
const groupList=async(req,res)=>{
    
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
        const totalPosts = await Group.countDocuments().exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        if (endIndex < (await Group.countDocuments().exec())) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }
        result.data = await Group.find()
        // .sort("-_id")
        .sort(sortObject)
        .find({
            $or:[
                {group_name:{$regex:'.*'+search+'.*',$options:'i'}},
            ]
        })
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

// delete group
const deleteGroup=async(req,res)=>{
    try{

        const id=req.query.id;
        await Group.deleteOne({_id:id});
    res.status(200).send({success:true,msg:"Group can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// user profile edit & update

const editProfileLoad=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await Group.findById({_id:id});

       if(userData){

        
        res.status(200).send({success:true,group:userData})

       }
       else{
       
        res.status(200).send({success:false})
       }

    }
    catch(error){
        res.status(400).send(error.message);
    }
}

// update profile

const updateProfile=async(req,res)=>{
    try{

       const userData= await Group.findByIdAndUpdate({_id:req.params.id},{$set:{group_name:req.body.group_name, group_description:req.body.group_description,status:req.body.status}});
       res.status(200).send({sucess:true,msg:"sucessfully updated",group:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}
module.exports={

    addGroup,
    groupList,
    deleteGroup,
    editProfileLoad,
    updateProfile,
    getCountries,
    getStates,
    getCities,
    grouptotal,
    
}
