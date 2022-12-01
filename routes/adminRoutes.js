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

admin_route.post('/add_group',adminController.addGroup);

admin_route.get('/group-list',adminController.groupList);

admin_route.get('/delete-group',adminController.deleteGroup);

admin_route.get('/edit-user',adminController.editProfileLoad);

admin_route.put('/edit-user/:id',adminController.updateProfile);

// contact route
admin_route.post('/add_contact',adminController.addContact);
admin_route.get('/contact-list',adminController.contactList);
admin_route.get('/delete-contact',adminController.deleteContact);
admin_route.get('/edit-contact',adminController.editContact);
admin_route.put('/edit-contact/:id',adminController.updateContact);
admin_route.get('/get-countries',adminController.getCountries);
admin_route.get('/get-states',adminController.getStates);
admin_route.get('/get-cities',adminController.getCities)


// lead route
admin_route.post('/add_lead',adminController.addLead);
admin_route.get('/lead-list',adminController.leadList);
admin_route.get('/delete-lead',adminController.deleteLead);
admin_route.get('/edit-lead',adminController.editLead);
admin_route.put('/edit-lead/:id',adminController.updateLead);

// customer route
admin_route.post('/add_customer',adminController.addCustomer);
admin_route.get('/customer-list',adminController.customerList);
admin_route.get('/delete-customer',adminController.deleteCustomer);
admin_route.get('/edit-customer',adminController.editCustomer);
admin_route.put('/edit-customer/:id',adminController.updateCustomer);

// // business opportunity route
admin_route.post('/add_business',adminController.businessOpportunity);
admin_route.get('/business-list',adminController.businessList);
admin_route.get('/delete-business',adminController.deleteBusiness);
admin_route.get('/edit-business',adminController.editBusinessLoad);
admin_route.put('/edit-business/:id',adminController.updateBusiness);

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