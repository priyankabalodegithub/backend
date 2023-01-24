const {check}=require('express-validator');

exports.docValidation=[
    check('document').custom((value,{req})=>{
     if(req.file.mimetype==='application/msword'
     || req.file.mimetype==='application/vnd.ms-excel'
     || req.file.mimetype==='application/pdf'){
        return true;
     } 
     else{
        return false;
     }
    }).withMessage('Please upload a doc,xls,or pdf files!')
]