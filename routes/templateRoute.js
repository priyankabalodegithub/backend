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
const storage1=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/documents'),function(error,success){
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

const fileFilter=(req,file,cb)=>{
    (file.mimetype==='application/msword' 
    || file.mimetype==='application/vnd.ms-excel'
    ||  file.mimetype==='application/pdf')
    ? cb(null,true)
    : cb(null,false)
}
const upload=multer({storage:storage});
const uploadDoc=multer({
    storage:storage1,
    fileFilter:fileFilter
 });
const tempalteController=require('../controllers/templateController');
const {docValidation}=require('../helpers/validation')

template_route.post('/add-template',upload.single('image'),tempalteController.addTemplate);
template_route.get('/template-list',tempalteController.templateList);
template_route.get('/edit-template',tempalteController.editTemplate);
// template_route.put('/edit-template/:id',tempalteController.updateTemplate);

template_route.get('/language-list',tempalteController.languageList);


module.exports=template_route;