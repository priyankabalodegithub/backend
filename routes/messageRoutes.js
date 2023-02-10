const express=require('express');
const message_route=express();

const bodyParser=require('body-parser');
message_route.use(bodyParser.json());
message_route.use(bodyParser.urlencoded({extended:true}));

const messageController=require('../controllers/messageController');


// message route
message_route.post('/add-message',messageController.addMessage);
message_route.post('/send-members',messageController.sendMembers);

message_route.get('/send-message',messageController.messageSend);
message_route.get('/send-messageLater',messageController.messageSendLater);



module.exports=message_route;