
const Staff=require('../models/tbl_staff');
const Right=require('../models/tbl_rights');
const Permission=require('../models/staff_permission')
const bcrypt=require('bcrypt');
const randomstring=require('randomstring');
const config=require("../config/config");
// const nodemailer=require('nodemailer');
const jwt=require('jsonwebtoken');
const tbl_module = require('../models/tbl_module');


// Add staff
const addStaff = async (req, res) => {
  try {
    const staff = new Staff({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      designation: req.body.designation,
      primary_contact_number: req.body.primary_contact_number,
      secondary_contact_number: req.body.secondary_contact_number,
      email: req.body.email,
    });
    staff.save().then(async (userData) => {
      let permissionArray = [];
      req.body.permissions.forEach((data) => {
        data.childs.forEach((childData) => {
          const childPermission = childData.permission.map(
            (_permissionList) => {
              console.log(_permissionList)
              return {
                permission: _permissionList.isSelected,
                right_detail: _permissionList.name,
                staff_id: userData._id,
                rights_id: childData._id,
              }; 
              
            }
            
          );
          console.log(childPermission)
         

          permissionArray = [...permissionArray, ...childPermission];
        });
      });
      permissionArray = permissionArray.filter((data) => data);
      const permissionData = await Permission.insertMany(permissionArray);
      console.log("permissionData", permissionData);
      if (userData && permissionData) {
        res.status(200).send({
          success: true,
          data: userData,
          msg: "Data save successfully.",
        });
      } else {
        res.status(200).send({ msg: "group data failed" });
      }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

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
// get base structure
const getRightList = async() => {
  let userData=await Right.aggregate([
    {
        $lookup:{
            from:'tbl_modules',
            localField:'module_id',
            foreignField:'_id',
            as:'module_id'
        }
    }
])
userData =   userData.map((data) => {
    return {
        ...data,
        moduleName: data.module_id[0].module || '',
        moduleId: data.module_id[0]._id || ''
    }

}).reduce((list, data)=> {
   const moduleIndex = list.findIndex((lst) => lst.moduleName === data.moduleName);
   if(moduleIndex === -1) {
    list.push({
        moduleName: data.moduleName,
        moduleId: data.moduleId,
        childs: [{
            _id: data._id,
            title: data.title
        }]
    })
   } else {
    list[moduleIndex].childs.push({
        _id: data._id,
        title: data.title
    })
   }
   return list;
}, []);

return userData;
}

// tables rights
const rightList=async(req,res)=>
{
    try{

        let userData= await getRightList();
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
const staffList = async (req, res) => {
  try {
    var sortObject = {};
    var stype = req.query.sorttype ? req.query.sorttype : "_id";
    var sdir = req.query.sortdirection ? req.query.sortdirection : 1;
    sortObject[stype] = sdir;

    var search = "";
    if (req.query.search) {
      search = req.query.search;
    }

    const pageNumber = parseInt(req.query.pageNumber) || 0;
    const limit = parseInt(req.query.limit) || 4;
    const result = {};
    const totalPosts = await Staff.countDocuments().exec();
    let startIndex = pageNumber * limit;
    const endIndex = (pageNumber + 1) * limit;
    result.totalPosts = totalPosts;
    if (startIndex > 0) {
      result.previous = {
        pageNumber: pageNumber - 1,
        limit: limit,
      };
    }
    if (endIndex < (await Staff.countDocuments().exec())) {
      result.next = {
        pageNumber: pageNumber + 1,
        limit: limit,
      };
    }
    const staffList = await Staff.find()
      .sort(sortObject)
      .skip(startIndex)
      .limit(limit)
      .find({
        $or: [
          { first_name: { $regex: ".*" + search + ".*", $options: "i" } },
          { email: { $regex: ".*" + search + ".*", $options: "i" } },
          {
            primary_contact_number: {
              $regex: ".*" + search + ".*",
              $options: "i",
            },
          },
        ],
      })
      .exec();

    const permissionList = await Promise.all(
      staffList?.map(async (lst) => {
        let permission = await Permission.find({
          staff_id: lst._id,
        })
          // .populate("rights_id")
          .populate({
            path: "rights_id",
            populate: {
              path: "module_id",
              model: "Tbl_Module",
            },
          })
          .exec();
          const {_doc: staffDetails} = lst;
          const permissionModuleList = []
          permission = permission.map((details) => {
            let _details =   {
              _id: details._id,
              name: details.right_detail,
              permission: details.permission,
              childModuleName: details.rights_id.title
            }
            if(details.permission === true) {
              const childModule = permissionModuleList.find((moduleName) => moduleName === _details.childModuleName);
              if(!childModule) {
                permissionModuleList.push(_details.childModuleName)
              }
            }
            return _details;
          });
        return {
          ...staffDetails,
          // permission,
          permissionModuleList: permissionModuleList.join(', ')
        };
      })
    );
    result.rowsPerPage = limit;
    return res.send({
      msg: "Posts Fetched successfully",
      data: { ...result, data: permissionList },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
};

//simple staff list

const allstaffList=async(req,res)=>{
  try{

      const userData=await Staff.find();
  res.status(200).send({success:true,data:userData});

  }
  catch(err){
      res.status(400).send(err.message);
  }
}

const mapChildData = (moduleDetails, permissionList) => {
 const data =  moduleDetails.childs.map((subChild) => {
    const permissionDetails = permissionList.filter((_pDeatils) => _pDeatils.rights_id._id.equals(subChild._id) ? true : false);
    return {
      ...subChild,
      permissions: [...permissionDetails]
    }
  })

  return data;
}

// delete staff
const deleteStaff=async(req,res)=>{

  try{

    const id=req.query.id;
    const userData= await Staff.deleteOne({_id:id});
    const permission = await Permission.deleteMany({
    staff_id: id,
    })
      .populate("rights_id")
      .populate({
        path: "rights_id",
        populate: {
          path: "module_id",
          model: "Tbl_Module",
        },
      })
      .exec();
    
    return res.send({
      msg: " delete data successfully",
      
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
  
}

// staff edit & update

const editStaff=async(req,res)=>{

  try{

    const id=req.query.id;
    const userData=await Staff.find({_id:id})
    const permission = await Permission.find({
      staff_id: id,
    })
      .populate("rights_id")
      .populate({
        path: "rights_id",
        populate: {
          path: "module_id",
          model: "Tbl_Module",
        },
      })
      .exec();
      let {_doc: userDetails} = userData[0];
    // console.log(userDetails)
    const permissionList = {
      ...userDetails,
      permission
    }

    let permissionBaseStructure = await getRightList();
    permissionList.permission = permissionBaseStructure.map((moduleDetails) => {
      return {
        ...moduleDetails,
        childs: mapChildData(moduleDetails, permissionList.permission)
      }
    })

    return res.send({
      msg: " fetch data successfully",
      staff: permissionList,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
  
}
// update staff
const updateStaff=async(req,res)=>{
  try{

     const StaffData= await Staff.findByIdAndUpdate({_id:req.params.id},{$set:{first_name:req.body.first_name, last_name:req.body.last_name,designation:req.body.designation,
     primary_contact_number:req.body.primary_contact_number,secondary_contact_number:req.body.secondary_contact_number,email:req.body.email,
    }})
    
    let updateList = [];
    req.body.permissions.map((data) => {
      data.childs.map((child) => {
        if(child) {
          updateList.push(...child.permission)
        }
      })
    })
    updateList = await  Promise.all(updateList.map(async(data) => {
      // const update =   {
      //   _id:data._id,
      //   permission: data.isSelected
      // }
     return await Permission.findByIdAndUpdate({_id:data._id},{$set:{permission: data.isSelected}});
    }))
    console.log(updateList);
    // const permission =
    // console.log(permission);

    return res.send({
      msg: " update data successfully",
     
    });

  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Sorry, something went wrong" });
  }
}
module.exports={
    
    addStaff,
    rightList,
    addPermission,
    staffList,
    editStaff,
    updateStaff,
    deleteStaff,
    allstaffList,
    emailExist,
    contactExist
  
}

