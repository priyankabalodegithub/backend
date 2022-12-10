const Admin=require('../models/admin_users');
const Group=require('../models/tbl_group');
const Contact=require('../models/tbl_contacts');
const Lead=require('../models/tbl_lead');
const Customer=require('../models/tbl_customer');
const Business=require('../models/tbl_business_opportunities');
const bcrypt=require('bcrypt');
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

// secure password
const securePassword=async(password)=>{
    try{

       const passwordHash=await bcrypt.hash(password,10)
       return passwordHash;

    }
    catch(err)
    {
        console.log(err.message);
    }
}


// admin user

const insertUser=async(req,res)=>{
    try{
            const spassword=await securePassword(req.body.password);
            const user=new Admin({
                username:req.body.username,
                password:spassword,
                name:req.body.name,
                mobile:req.body.mobile,
                email:req.body.email,
                address:req.body.address,
                profile_photo:'',
                
        })
            const userData=await user.save();

            if(userData)
            {
               
                
                res.status(200).send({success:true,data:userData,msg:"your registration has been successfully."})
            }
            else
            {
                res.status(200).send({success:false,msg:"your registration has been failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }

}

// verify admin login

const verifyLogin=async(req,res)=>{
    try{
        const username=req.body.username;
        const password=req.body.password;
        const userData=await Admin.findOne({username:username});
        if(userData){

           const passwordMatch=await bcrypt.compare(password,userData.password);

           if(passwordMatch)
           {
                
                const tokenData=await create_token(userData._id);

            const userResult={
                _id:userData._id,
                username:userData.username,
                password:userData.password,
                name:userData.name,
                mobile:userData.mobile,
                email:userData.email,
                address:userData.address,
                profile_photo:userData.profile_photo,
                token:tokenData

            }

            const response={
                success:true,
                msg:"user details",
                data:userResult
            }
            res.status(200).send(response)
                
            }

           else{
            
            res.status(200).send({msg:"username and password is incorrect"})
           }

        }
        else{
            res.status(200).send({msg:"username and password is incorrect"})
        }

    }
    catch(err){
        res.status(400).send(err.message);
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

// group list
const groupList=async(req,res)=>{
    try{

        const userData=await Group.find({ is_group:1});
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
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

// add contact
const addContact=async(req,res)=>{
    try{
            
            const contact=new Contact({
                first_name:req.body.first_name,
                last_name:req.body. last_name,
                designation:req.body.designation,
                company_name:req.body.company_name,
                primary_contact_number:req.body.primary_contact_number,
                secondary_contact_number:req.body.secondary_contact_number,
                email:req.body.email,
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
            const userData=await contact.save();

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


// contact list
const contactList=async(req,res)=>{
    try{
        
        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 4;
        const result = {};
        const totalPosts = await Contact.countDocuments().exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        if (endIndex < (await Contact.countDocuments().exec())) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }
        result.data = await Contact.find()
        .populate('group')
        // .sort("-_id")
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


// delete contact
const deleteContact=async(req,res)=>{
    try{

        const id=req.query.id;
        await Contact.deleteOne({_id:id});
    res.status(200).send({success:true,msg:"Contact can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// contact edit & update

const editContact=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await Contact.findById({_id:id}).populate('group');

       if(userData){

         res.status(200).send({success:true,contact:userData})
       
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

const updateContact=async(req,res)=>{
    try{

       const userData= await Contact.findByIdAndUpdate({_id:req.params.id},{$set:{first_name:req.body.first_name, last_name:req.body.last_name,designation:req.body.designation,
        company_name:req.body.company_name,primary_contact_number:req.body.primary_contact_number,secondary_contact_number:req.body.secondary_contact_number,email:req.body.email,
        group:req.body.group,status:req.body.status,address1:req.body.address1,address2:req.body.address2,taluka:req.body.taluka,village:req.body.village,zipcode:req.body.zipcode,
        city:req.body.city,state:req.body.state,country:req.body.country}});
       res.status(200).send({sucess:true,msg:"sucessfully updated",group:userData})

    }
    catch(error){
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

// lead list

const leadList=async(req,res)=>{
    try{

        const userData=await Lead.find({type:1});
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
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
       const userData=await Lead.findById({_id:id});

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

const updateLead=async(req,res)=>{
    try{

       const userData= await Lead.findByIdAndUpdate({_id:req.params.id},{$set:{first_name:req.body.first_name, last_name:req.body.last_name,designation:req.body.designation,
        company_name:req.body.company_name,email:req.body.email,primary_contact_number:req.body.primary_contact_number,secondary_contact_number:req.body.secondary_contact_number,business_opportunity:req.body.business_opportunity,
        group:req.body.group,status:req.body.status,address1:req.body.address1,address2:req.body.address2,taluka:req.body.taluka,village:req.body.village,zipcode:req.body.zipcode,
        city:req.body.city,state:req.body.state,country:req.body.country}});
       res.status(200).send({sucess:true,msg:"sucessfully updated",group:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}


// add customer
const addCustomer=async(req,res)=>{
    try{
            
            const customer=new Customer({
                first_name:req.body.first_name,
                last_name:req.body. last_name,
                designation:req.body.designation,
                company_name:req.body.company_name,
                email:req.body.email,
                primary_contact_number:req.body.primary_contact_number,
                secondary_contact_number:req.body.secondary_contact_number,
                service_offered:req.body.service_offered,
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
            const userData=await customer.save();

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
// customer list
const customerList=async(req,res)=>{
    try{

        const userData=await Customer.find({type:1});
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// delete customer
const deleteCustomer=async(req,res)=>{
    try{

        const id=req.query.id;
        await Customer.deleteOne({_id:id});
    res.status(200).send({success:true,msg:"Customer can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}
// customer edit & update

const editCustomer=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await Customer.findById({_id:id});

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

const updateCustomer=async(req,res)=>{
    try{

       const userData= await Customer.findByIdAndUpdate({_id:req.params.id},{$set:{first_name:req.body.first_name, last_name:req.body.last_name,designation:req.body.designation,
        company_name:req.body.company_name,email:req.body.email,primary_contact_number:req.body.primary_contact_number,secondary_contact_number:req.body.secondary_contact_number,service_offered:req.body.service_offered,
        group:req.body.group,status:req.body.status,address1:req.body.address1,address2:req.body.address2,taluka:req.body.taluka,village:req.body.village,zipcode:req.body.zipcode,
        city:req.body.city,state:req.body.state,country:req.body.country}});
       res.status(200).send({sucess:true,msg:"sucessfully updated",group:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}

//add business opportunity
const businessOpportunity=async(req,res)=>{
    try{
            
            const business=new Business({
                title:req.body.title,
                is_active:req.body.is_active,         
                
        })
            const userData=await business.save();

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

// business opportunity list

const businessList=async(req,res)=>{
    try{

        const userData=await Business.find({ type:1});
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}

// delete Business
const deleteBusiness=async(req,res)=>{
    try{

        const id=req.query.id;
        await Business.deleteOne({_id:id});
    res.status(200).send({success:true,msg:"business can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// business profile edit & update

const editBusinessLoad=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await Business.findById({_id:id});

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

const updateBusiness=async(req,res)=>{
    try{

       const userData= await Business.findByIdAndUpdate({_id:req.params.id},{$set:{title:req.body.title,is_active:req.body.is_active}});
       res.status(200).send({sucess:true,msg:"sucessfully updated",group:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}


module.exports={
    verifyLogin,
    insertUser,
    addGroup,
    groupList,
    deleteGroup,
    editProfileLoad,
    updateProfile,
    addContact,
    addLead,
    addCustomer,
    contactList,
    leadList,
    customerList,
    deleteContact,
    deleteCustomer,
    deleteLead,
    editContact,
    updateContact,
    updateCustomer,
    editCustomer,
    updateLead,
    editLead,
    businessOpportunity,
    businessList,
    deleteBusiness,
    editBusinessLoad,
    updateBusiness,
    getCountries,
    getStates,
    getCities
    
}

