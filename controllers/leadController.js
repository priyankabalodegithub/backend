
const Lead=require('../models/tbl_lead');
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

// add lead

const addLead=async(req,res)=>{
    try{
            
            const lead=new Lead({
                first_name:req.body.first_name,
                last_name:req.body. last_name,
                designation:req.body.designation,
                company_name:req.body.company_name,
                email:req.body.email,
                primary_contact_number:req.body.primary_contact_number,
                secondary_contact_number:req.body.secondary_contact_number,
                business_opportunity:req.body.business_opportunity,
                group:req.body.group,
                status:req.body.status,
                address1:req.body.address1,
                address2:req.body.address2,
                taluka:req.body.taluka,
                village:req.body.village,
                zipcode:req.body.zipcode,
                city:req.body.city,
                state:req.body.state,
                country:req.body.country,   
                
        })
            const userData=await lead.save();

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
// email exist

const emailExist=async(req,res)=>{

    try{
       
        Lead.find({email:req.query.email})
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

// email exist

const contactExist=async(req,res)=>{

    try{
       
        Lead.find({primary_contact_number:req.query.primary_contact_number})
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


// lead list

const leadList=async(req,res)=>{
   
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
        const totalPosts = await Lead.countDocuments().exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        if (endIndex < (await Lead.countDocuments().exec())) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }
        result.data = await Lead.find()
        .populate('group business_opportunity')
        .find({
            $or:[
                {first_name:{$regex:'.*'+search+'.*',$options:'i'}},
                {email:{$regex:'.*'+search+'.*',$options:'i'}},
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

// delete lead
const deleteLead=async(req,res)=>{
    try{

        const id=req.query.id;
        await Lead.deleteOne({_id:id});
    res.status(200).send({success:true,msg:"Lead can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// lead edit & update

const editLead=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await Lead.findById({_id:id}).populate('group business_opportunity');

       if(userData){

        
        res.status(200).send({success:true,lead:userData})

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

const updateLead=async(req,res)=>{
    try{

       const userData= await Lead.findByIdAndUpdate({_id:req.params.id},{$set:{first_name:req.body.first_name, last_name:req.body.last_name,designation:req.body.designation,
        company_name:req.body.company_name,email:req.body.email,primary_contact_number:req.body.primary_contact_number,secondary_contact_number:req.body.secondary_contact_number,business_opportunity:req.body.business_opportunity,
        group:req.body.group,status:req.body.status,address1:req.body.address1,address2:req.body.address2,taluka:req.body.taluka,village:req.body.village,zipcode:req.body.zipcode,
        city:req.body.city,state:req.body.state,country:req.body.country}})
       res.status(200).send({sucess:true,msg:"sucessfully updated",group:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}
module.exports={

    addLead,
    leadList,
    deleteLead,
    updateLead,
    editLead,
    getCountries,
    getStates,
    getCities,
    emailExist,
    contactExist
}