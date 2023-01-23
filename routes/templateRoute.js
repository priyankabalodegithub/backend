const express=require('express');
const template_route=express();

const bodyParser=require('body-parser');
template_route.use(bodyParser.json());
template_route.use(bodyParser.urlencoded({extended:true}));

const multer=require('multer');
const path=require("path");

template_route.use(express.static('public'));

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/templateimages'),function(error,success){
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
const templateController=require('../controllers/templateController');


template_route.post('/add-template',upload.single('image'),templateController.addTemplate);
template_route.get('/language-list',templateController.languageList);




module.exports=template_route;