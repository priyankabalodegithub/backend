const express=require('express');
const admin_route=express();
const session=require('express-session');

const config=require('../config/config');

admin_route.use(session({secret:config.sessionSecret}));

const bodyParser=require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

const multer=require('multer');
const path=require("path");

admin_route.use(express.static('public'));

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


const adminController=require('../controllers/adminController');
const managementController=require('../controllers/managementController')
// const auth=require("../middleware/auth")
const jwtHelper=require('../config/jwtHelper')

admin_route.post('/register',adminController.insertUser);

admin_route.post('/login',adminController.verifyLogin);


// staff management
admin_route.post('/add-staff',managementController.addStaff);
admin_route.post('/add-right',managementController.addRights);
admin_route.get('/right-list',managementController.rightList);
admin_route.get('/delete-staff',managementController.deletestaff);
admin_route.get('/edit-staff',managementController.editstaff);


admin_route.get('/test',jwtHelper,function(req,res){
    res.status(200).send({success:true,msg:"authentication"})
})


module.exports=admin_route;