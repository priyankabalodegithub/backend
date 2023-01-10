const express=require('express');
const task_route=express();
const session=require('express-session');

const config=require('../config/config');

task_route.use(session({secret:config.sessionSecret}));

const bodyParser=require('body-parser');
task_route.use(bodyParser.json());
task_route.use(bodyParser.urlencoded({extended:true}));

const multer=require('multer');
const path=require("path");

task_route.use(express.static('public'));

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

const taskManagementController=require('../controllers/task_managementController')
const jwtHelper=require('../config/jwtHelper')

// task management
task_route.post('/add-source', taskManagementController.contactSource);
task_route.get('/source-list', taskManagementController.sourceList);
task_route.post('/add-sales', taskManagementController.salesPhase);
task_route.get('/sales-list', taskManagementController.salesList);
task_route.post('/add-action',taskManagementController.addAction);
task_route.get('/action-list', taskManagementController.actionList);
task_route.post('/add-task', taskManagementController.addTask);
// task_route.put('/edit-staff/:id',taskManagementController.updateStaff);

// task_route.get('/exist-Staffemail',taskManagementController.emailExist);
// task_route.get('/exist-Staffcontact',taskManagementController.contactExist);

// task_route.get('/test',jwtHelper,function(req,res){
//     res.status(200).send({success:true,msg:"authentication"})
// })


module.exports=task_route;