
const Message=require('../models/tbl_messages');


// add lead

const addMessage=async(req,res)=>{
    try{
            
            const message=new Message({
                message:req.body.message,
                language:req.body. language,
                template_name:req.body.template_name,
                template_id:req.body.template_id,
                group_id:req.body.group_id,
                is_send:req.body.is_send,
                when_to_send:req.body.when_to_send,
                
        })
            const userData=await message.save()

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

    addMessage,

}