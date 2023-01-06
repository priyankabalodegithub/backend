const express=require('express');
const staff_route=express();
const session=require('express-session');

const config=require('../config/config');

staff_route.use(session({secret:config.sessionSecret}));

const bodyParser=require('body-parser');
staff_route.use(bodyParser.json());
staff_route.use(bodyParser.urlencoded({extended:true}));

const multer=require('multer');
const path=require("path");

staff_route.use(express.static('public'));

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'),function(error,success){
            if(error) throw error
        });
    },

    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name,function(error1,success1){
            if(error1) throw error1
        })
    }
});

const upload=multer({storage:storage});

const staffManagementController=require('../controllers/staff_managementController')
const jwtHelper=require('../config/jwtHelper')

// staff management
staff_route.post('/add-staff', staffManagementController.addStaff);
staff_route.post('/add-permission', staffManagementController.addPermission);
staff_route.get('/staffpermission-list', staffManagementController.staffList);
staff_route.get('/right-list', staffManagementController.rightList);
staff_route.get('/delete-staff',staffManagementController.deleteStaff);
staff_route.get('/edit-staff', staffManagementController.editStaff);
staff_route.put('/edit-staff/:id',staffManagementController.updateStaff);

staff_route.get('/exist-Staffemail',staffManagementController.emailExist);
staff_route.get('/exist-Staffcontact',staffManagementController.contactExist);

staff_route.get('/test',jwtHelper,function(req,res){
    res.status(200).send({success:true,msg:"authentication"})
})


module.exports=staff_route;