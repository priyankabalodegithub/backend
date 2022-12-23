const mongoose=require('mongoose')
const customerSchema=new mongoose.Schema({
    first_name:{
       type:String,
       required:true
    },
    last_name:{
       type:String,
       required:true
    },
   
    designation:{
       type:String,
       required:true
    },
    company_name:{
       type:String,
       required:true
    },
    email:{
       type:String,
       required:true
    },
    primary_contact_number:{
       type:String,
       required:true
    },
    secondary_contact_number:{
       type:String,
       
    },
   service_offered:[{
      type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Service_Offered',
       required:true
   }],
    
    group:[{
      type:mongoose.Schema.Types.ObjectId,ref:'Tbl_Group',
       required:true
   }],
     status:{
       type:Boolean,
       default:true
    },
    address1:{
       type:String,
       required:true
    },
    address2:{
       type:String,
      
    },
    taluka:{
       type:String,
      
    },
    village:{
       type:String,
       
    },
    zipcode:{
       type:String,
       required:true
    },
    city:{
       type:String,
       
    },
    state:{
       type:String,
       
    },
    country:{
       type:String,
    },
    
   type:{
      type:Number,
      default:1
   }
     
   },
   {timestamps:true}
   );
   module.exports=mongoose.model('Tbl_Customer',customerSchema)