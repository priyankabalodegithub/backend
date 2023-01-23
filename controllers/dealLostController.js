
const DealLost=require('../models/tbl_dealLostReason')


//add service Offered
const addDealLostReason=async(req,res)=>{
    try{
            
            const deal=new DealLost({
                dealLostReason:req.body.dealLostReason,       
                
        })
            const userData=await deal.save();

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
// reasonList list

const reasonList=async(req,res)=>{
    try{

        const userData=await DealLost.find();
    res.status(200).send({success:true,data:userData});

    }
    catch(err){
        res.status(400).send(err.message);
    }
}


module.exports={
    addDealLostReason,
    reasonList
}

