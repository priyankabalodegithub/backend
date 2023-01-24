const Template=require('../models/tbl_template');
const Language=require('../models/tbl_language');
const {validationResult}=require('express-validator');

// add Template

const addTemplate=async(req,res)=>{
    try{
        var errors=validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
            const template=new Template({
                template_created_for:req.body.template_created_for,
                template_name:req.body.template_name,
                language:req.body.language,
                template_message:req.body.template_message,
                // document:req.file.filename,
                image:req.file.filename
                
        })
            const userData=await template.save();

            if(userData)
            {
               
                
                res.status(200).send({success:true,data:userData,msg:"your template has been successfully."})
            }
            else
            {
                res.status(200).send({success:false,msg:"your template has been failed"})
            }
    
    }
    catch(error)
    {
        
        res.status(400).send(error.message);
    }

}

// template list
const templateList=async(req,res)=>{
   
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
        const totalPosts = await Template.countDocuments().exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        if (endIndex < (await Template.countDocuments().exec())) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }
        result.data = await Template.find()
       
        .find({
            $or:[
                {template_name :{$regex:'.*'+search+'.*',$options:'i'}},
                {language:{$regex:'.*'+search+'.*',$options:'i'}},
                {template_created_for:{$regex:'.*'+search+'.*',$options:'i'}},
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

// edit template
const editTemplate=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await Template.findById({_id:id});

       if(userData){

        res.status(200).send({success:true,template:userData})

       }
       else{
       
        res.status(200).send({success:false})
       }

    }
    catch(error){
        res.status(400).send(error.message);
    }
}
// update list

// const updateTemplate=async(req,res)=>{
//     try{

//        const userData= await Template.findByIdAndUpdate({_id:req.params.id},
//         {$set:{
//             template_created_for:req.body.template_created_for, 
//             template_name:req.body.template_name,
//             language:req.body.language,
//             template_message:req.body.template_message,
//             document:req.body.document,
//             image:req.body.image
//         }})
//        res.status(200).send({sucess:true,msg:"sucessfully updated",updateData:userData})

//     }
//     catch(error){
//         res.status(400).send(error.message);
//     }
// }
// languages list

const languageList=async(req,res)=>{
    try{

        const userData=await Language.find();
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}


module.exports={
    addTemplate,
    languageList,
    templateList,
    editTemplate,
    // updateTemplate
}

