
const Message=require('../models/tbl_messages');
const MsgSend=require('../models/tbl_msgtosend');
const groupContact=require('../models/tbl_groupContact');



// add message for group

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
                contact_count:req.body.contact_count
               
                
        })
            const userData=await message.save().then(async (userData) => {
               const count=0
                for(var i=0; i< req.body.group_id.length;i++){
                    const contact = await groupContact.find().exec();
                    const groups = contact.find((data) => data.group_id.equals(req.body.group_id[i]) ? true : false);
                    console.log(groups);
                   
                    if(groups) {
                        const data = new MsgSend({
                            msg_id:userData._id,
                            contact_id:groups.contact_id
                           
                        })
                        const sendGroup = await data.save()
                    } 
            }
            });

            if(userData)
            {
               
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:" data failed"})
            }
    
    }
    catch(error)
    {
        console.log(error);
        res.status(400).send(error.message);
    }

}

// add message for members


const sendMembers=async(req,res)=>{
    try{
   
        
            const message=new Message({
                message:req.body.message,
                language:req.body. language,
                template_name:req.body.template_name,
                template_id:req.body.template_id,
                members:req.body.members,
                is_send:req.body.is_send,
                when_to_send:req.body.when_to_send,
                contact_count:req.body.members.length
                
        })
            const userData=await message.save().then(async (userData) => {
               
                for(var i=0; i< req.body.members.length;i++){
                   
                 
                        const data = new MsgSend({
                            msg_id:userData._id,
                            contact_id:req.body.members[i]
                           
                        })
                        const sendMembers = await data.save()
            }
            });

            if(userData)
            {
               
                res.status(200).send({success:true,data:userData,msg:"Data save successfully."})
            }
            else
            {
                res.status(200).send({msg:" data failed"})
            }
    
    }
    catch(error)
    {
        console.log(error);
        res.status(400).send(error.message);
    }

}

// message send list
const messageSend=async(req,res)=>{
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
        const totalPosts = await Message.countDocuments({is_send:1}).exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        if (endIndex < (await Message.countDocuments({is_send:1}).exec())) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }
        result.data = await Message.find({is_send:1})
        .populate('group_id template_id')
        .find({
            $or:[
                {template_name:{$regex:'.*'+search+'.*',$options:'i'}},
                // {group:{$regex:'.*'+search+'.*',$options:'i'}},
                // {primary_contact_number:{$regex:'.*'+search+'.*',$options:'i'}},
            ]
        })
        .sort(sortObject)
        .skip(startIndex)
        .limit(limit)
        .exec();

        
      result.rowsPerPage = limit;
      return res.send({
         msg: "Posts Fetched successfully", 
         data: result});

    }

    catch(error){
        console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
}

// message send list
const messageSendLater=async(req,res)=>{
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
        const totalPosts = await Message.countDocuments({is_send:0}).exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
          result.previous = {
            pageNumber: pageNumber - 1,
            limit: limit,
          };
        }
        if (endIndex < (await Message.countDocuments({is_send:0}).exec())) {
          result.next = {
            pageNumber: pageNumber + 1,
            limit: limit,
          };
        }
        result.data = await Message.find({is_send:0})
        .populate('group_id template_id')
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
      return res.send({
         msg: "Posts Fetched successfully", 
         data: result});

    }

    catch(error){
        console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
}


module.exports={

    addMessage,
    sendMembers,
    messageSend,
    messageSendLater

}