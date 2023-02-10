const express=require('express');
const template_route=express();

const bodyParser=require('body-parser');
template_route.use(bodyParser.json());
template_route.use(bodyParser.urlencoded({extended:true}));

const multer=require('multer');
const path=require("path");


template_route.use(express.static('public'));
// template_route.use('/image', express.static('./image'));
// template_route.use('/image', express.static('../public/image'));

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        if(file.mimetype === 'image/jpeg' 
        || file.mimetype === 'image/png'){
            cb(null,path.join(__dirname,'../public/image'));
        }
        else{
            cb(null,path.join(__dirname,'../public/document'));
        }
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const fileFilter = (req,file,cb) => {
    if (file.fieldname === "image") {
        (file.mimetype === 'image/jpeg' 
         || file.mimetype === 'image/png')
        ? cb(null,true)
        : cb(null,false);
    }
    else if(file.fieldname === "document"){
        (file.mimetype==='application/msword' 
            || file.mimetype==='application/vnd.ms-excel'
            ||  file.mimetype==='application/pdf')
        ? cb(null,true)
        : cb(null,false);
    }
}

const upload = multer({
    storage:storage,
    fileFilter:fileFilter
}).fields([{ name: 'document', maxCount: 1 }, { name: 'image', maxCount: 1 }]);

const tempalteController=require('../controllers/templateController');
const {docValidation}=require('../helpers/validation')
template_route.post('/add-template',upload,docValidation,tempalteController.addTemplate);
template_route.post('/add-templateSms',tempalteController.addTemplatesms);
template_route.get('/template-list',tempalteController.templateList);
template_route.get('/alltemplate-list',tempalteController.alltemplate);
template_route.get('/edit-template',tempalteController.editTemplate);
template_route.get('/delete-template',tempalteController.deleteTemplate);
template_route.put('/edit-template/:id',upload,docValidation,tempalteController.updateTemplate);
template_route.put('/edit-templateSms/:id',tempalteController.updateTemplateSms);

template_route.get('/language-list',tempalteController.languageList);


module.exports=template_route;