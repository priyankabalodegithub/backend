const Template=require('../models/tbl_template');
const Language=require('../models/tbl_language');

// add Template

const addTemplate=async(req,res)=>{
    try{
            const template=new Template({
                template_created_for:req.body.template_created_for,
                template_name:req.body.template_name,
                language:req.body.language,
                template_message:req.body.template_message,
                documents:'',
                image:req.file.filename,
                
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
    languageList
}

