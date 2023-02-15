
const Source = require('../models/tbl_contactSource');
const Contact = require('../models/tbl_contacts');
const Lead = require('../models/tbl_lead');
const Customer = require('../models/tbl_customer');
const Sales = require('../models/tbl_salesPhase');
const Action = require('../models/tbl_taskAction');
const Task = require('../models/tbl_taskManagement');
const TaskHistory = require('../models/task_history')

// add contact source
const contactSource = async (req, res) => {
    try {

        const source = new Source({
            name: req.body.name,

        })
        const userData = await source.save();

        if (userData) {

            res.status(200).send({ success: true, data: userData, msg: "Data save successfully." })
        }
        else {
            res.status(200).send({ msg: "data failed" })
        }

    }
    catch (error) {

        res.status(400).send(error.message);
    }
}


// contact source list

const sourceList = async (req, res) => {
    try {

        const userData = await Source.find();
        res.status(200).send({ success: true, data: userData });

    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

// add sales phase
const salesPhase = async (req, res) => {
    try {

        const sales = new Sales({
            name: req.body.name,

        })
        const userData = await sales.save();

        if (userData) {

            res.status(200).send({ success: true, data: userData, msg: "Data save successfully." })
        }
        else {
            res.status(200).send({ msg: "data failed" })
        }

    }
    catch (error) {

        res.status(400).send(error.message);
    }
}


// sales phase list

const salesList = async (req, res) => {
    try {

        const userData = await Sales.find();
        res.status(200).send({ success: true, data: userData });

    }
    catch (err) {
        res.status(400).send(err.message);
    }
}
// edit sales phase
const editSales=async(req,res)=>{
    try{

       const id=req.query.id;
       const userData=await Sales.findById({_id:id});

       if(userData){

        res.status(200).send({success:true,sales:userData})

       }
       else{
       
        res.status(200).send({success:false})
       }

    }
    catch(error){
        res.status(400).send(error.message);
    }
}

// update action
const updateSales=async(req,res)=>{
    try{

       const userData= await Sales.findByIdAndUpdate({_id:req.params.id},{$set:
        { name: req.body.name
        }});
       res.status(200).send({sucess:true,msg:"sucessfully updated",sales:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}

// add action
const addAction = async (req, res) => {
    try {

        const action = new Action({
            action: req.body.action,

        })
        const userData = await action.save();

        if (userData) {

            res.status(200).send({ success: true, data: userData, msg: "Data save successfully." })
        }
        else {
            res.status(200).send({ msg: "data failed" })
        }

    }
    catch (error) {

        res.status(400).send(error.message);
    }
}

// action already exist

const actionExist = async (req, res) => {

    try {

        Action.find({ action: req.query.action })
            .then(async resp => {
                if (resp.length != 0) {
                    return res.status(200).send({ success: false, msg: 'action alredy exist' })

                } else {
                    return res.status(200).send({ success: true, msg: 'action not exist' })
                }
            })

    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

// action list

const actionList = async (req, res) => {
    try {

        const userData = await Action.find();
        res.status(200).send({ success: true, data: userData });

    }
    catch (err) {
        res.status(400).send(err.message);
    }
}
// delete Business
const deleteAction=async(req,res)=>{
    try{

        const id=req.query.id;
        await Action.deleteOne({_id:id});
    res.status(200).send({success:true,msg:"action can be deleted"})

    }
    catch(err)
    {
       res.status(400).send(err.message)
    }
}

// update action
const updateAction=async(req,res)=>{
    try{

       const userData= await Action.findByIdAndUpdate({_id:req.params.id},{$set:
        { action: req.body.action
        }});
       res.status(200).send({sucess:true,msg:"sucessfully updated",action:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}


// Add task

const addTask = async (req, res) => {
    try {
        const salesData = await Sales.find().exec();
        // console.log(salesData);
        const selectedPhase = salesData.find((data) => data._id.equals(req.body.sales_phase));
        // console.log('selectedPhase', selectedPhase, req.body.sales_phase);
        const task = new Task({
            subject: req.body.subject,
            add_task_for: req.body.add_task_for,
            set_task_priority: req.body.set_task_priority,
            reason_to_change_task_priority: req.body.reason_to_change_task_priority,
            estimated_date: req.body.estimated_date,
            reason_to_change_estimated_date: req.body.reason_to_change_estimated_date,
            contact_source: req.body.contact_source,
            selected_list: req.body.selected_list,
            business_opportunity: req.body.business_opportunity,
            sales_phase: req.body.sales_phase,
            action: req.body.action,
            action_date: req.body.action_date,
            remarks: req.body.remarks,
            assign_task_to: req.body.assign_task_to,
            budget: req.body.budget,
            client_firstName: req.body.client_firstName,
            client_lastName: req.body.client_lastName,
            client_contactNumber: req.body.client_contactNumber,
            client_email: req.body.client_email,
            level_of_urgency: req.body.level_of_urgency,
            task_status:req.body.task_status,
            task_completed:req.body.task_completed
            // is_completed:req.body.is_completed,
            // note:req.body.note,
            // reason_for_dealLost:req.body.reason_for_dealLost
        })
        const userData = await task.save().then(async (userData) => {
            const history = new TaskHistory({
                task_id: userData._id,
                sales_phase: userData.sales_phase,
                action: userData.action,
                action_date: userData.action_date,
                remarks: userData.remarks,
                assign_task_to: userData.assign_task_to,
                budget: userData.budget,
                task_status: userData.task_status,
                level_of_urgency: userData.level_of_urgency,
                reason_for_dealLost: userData.reason_for_dealLost,
                lead_status:selectedPhase.name !=='Initial Contact' ? Number(req.body.level_of_urgency) : 1,
                is_completed:req.body.is_completed,
                note:req.body.note,
                reason_for_dealLost:req.body.reason_for_dealLost,
                task_completed:userData.task_completed
            })
            const historyData = await history.save()
            return historyData

        }).then(async (historyData) => {
            if(req.body.add_task_for=='contact' && selectedPhase.name !=='Initial Contact')
            {
              const contactData = new Contact({
               first_name:req.body.client_firstName,
               last_name:req.body.client_lastName,
               primary_contact_number:req.body.client_contactNumber,
               email:req.body.client_email,

            })
          
            const Data = await contactData.save()

        }else if(req.body.add_task_for=='lead' && selectedPhase.name !=='Initial Contact')
        {
            const leadData = new Lead({
               first_name:req.body.client_firstName,
               last_name:req.body.client_lastName,
               primary_contact_number:req.body.client_contactNumber,
               email:req.body.client_email,

            })
           
            const Data = await leadData.save()
            
        }
        else if(req.body.add_task_for=='customer' && selectedPhase.name !=='Initial Contact')
        {
             const customerData = new Customer({
               first_name:req.body.client_firstName,
               last_name:req.body.client_lastName,
               primary_contact_number:req.body.client_contactNumber,
               email:req.body.client_email,

            })
            const Data = await customerData.save()
        }
           
        })

        if (userData) {

            res.status(200).send({ success: true, data: userData, msg: "Data save successfully." })
        }
        else {
            res.status(200).send({ msg: "contact data failed" })
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }

}

// add next action

const addnextAction=async(req,res)=>{
    try{
          
        const history = new TaskHistory({

                task_id: req.body._id,
                sales_phase: req.body.sales_phase,
                action: req.body.action,
                action_date: req.body.action_date,
                remarks: req.body.remarks,
                assign_task_to: req.body.assign_task_to,
                budget: req.body.budget,
                task_status: req.body.task_completed === '1' ? 3 : 2,
                level_of_urgency: req.body.level_of_urgency,
                reason_for_dealLost: req.body.reason_for_dealLost,
                lead_status:req.body.sales_phase[0].name !=='Initial Contact' ? Number(req.body.level_of_urgency) : 1,
                is_completed:req.body.is_completed,
                next_action:req.body.next_action,
                note:req.body.note,
                reason_for_dealLost:req.body.reason_for_dealLost,
                task_completed:req.body.task_completed
                
        })
        const historyData = await history.save().then(async (historyDetails) => {
           const task= await Task.findByIdAndUpdate(
                {
                    _id: req.body._id
                }, {
                $set: {
                    task_status: req.body.task_completed === '1' ? 3 : 2,
                }
            })
            const taskData = await task.save();
            return historyDetails;
        })

            if(historyData)
            {
               
                
                res.status(200).send({success:true,data:historyData,msg:"Data save successfully."})
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
// task list

const taskList = async (req, res) => {

    try {
        var sortObject = {};
        var stype = req.query.sorttype ? req.query.sorttype : '_id';
        var sdir = req.query.sortdirection ? req.query.sortdirection : 1;
        sortObject[stype] = sdir;


        var search = '';
        if (req.query.search) {
            search = req.query.search
        }

        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 4;
        const result = {};
        const totalPosts = await Task.countDocuments().exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber - 1,
                limit: limit,
            };
        }
        if (endIndex < (await Task.countDocuments().exec())) {
            result.next = {
                pageNumber: pageNumber + 1,
                limit: limit,
            };
        }

        result.data = await Task.find()
            .populate('contact_source action business_opportunity sales_phase')
            .populate({

                path: "assign_task_to",
                model: "Tbl_Staff",

            })

            .find({
                $or: [
                    { first_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                ]
            })
            .sort(sortObject)
            .skip(startIndex)
            .limit(limit)
            .exec();
        // let taskHistory = await TaskHistory.find()

        //     .exec();
        const list = await Promise.all(result.data.map(async (data) => {
            // console.log('data', data);
            let query;
            if (data && data.add_task_for && data.add_task_for === 'customer') {
                query = Customer.find({ _id: data.selected_list }).populate('service_offered group')
            }
            if (data && data.add_task_for && data.add_task_for === 'contact') {
                query = Contact.find({ _id: data.selected_list }).populate('group')
            }
            if (data && data.add_task_for && data.add_task_for === 'lead') {
                query = Lead.find({ _id: data.selected_list }).populate('business_opportunity group')
            }

            // console.log('query', query);

            let selected_list = query ? query.exec() : [];
            const { _doc: _result } = data;
            // console.log(_result);
            return {
                ..._result,
                // taskHistory,
                // task_status:taskHistory[0].task_status,
                action: _result.action[0].action,
                assign_task_to: {
                    ..._result.assign_task_to,
                    fullName: _result.assign_task_to[0].first_name + ' ' + _result.assign_task_to[0].last_name
                },
                sales_phase:_result.sales_phase[0].name,
                selected_list: selected_list && selected_list.length > 0 ? selected_list[0] : {}
            }

        }))
        result.rowsPerPage = limit;
        return res.send({ msg: "Posts Fetched successfully", data: { ...result, data: list } });

    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
}

// delete task
const deleteTask = async (req, res) => {
    try {

        const id = req.query.id;
        await Task.deleteOne({ _id: id });
        res.status(200).send({ success: true, msg: "Task can be deleted" })

    }
    catch (err) {
        res.status(400).send(err.message)
    }
}
// edit task

const editTask = async (req, res) => {
    try {
        var sortObject = {};
        var stype = req.query.sorttype ? req.query.sorttype : 'status_date';
        var sdir = req.query.sortdirection ? req.query.sortdirection : -1;
        sortObject[stype] = sdir;

        const id = req.query.id;
        const userData = await Task.findById({ _id: id }).populate('contact_source action business_opportunity sales_phase')
            .populate({

                path: "assign_task_to",
                model: "Tbl_Staff",

            })

        const taskHistory = await TaskHistory.find({
            task_id: id,
            
        }).populate('sales_phase action assign_task_to')
        .sort(sortObject)
            .exec();
        let { _doc: userDetails } = userData;
        // console.log(userDetails)
        const taskList = {
            ...userDetails,
            taskHistory
        }

        return res.send({
            msg: " fetch data successfully",
            task: taskList,
        });

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}
// update task
const updateTask = async (req, res) => {
    try {
        let _promise = Promise.resolve();
        _promise.then(async () => {
            await Task.findByIdAndUpdate(
                {
                    _id: req.params.id
                }, {
                $set: {
                    subject: req.body.subject,
                    add_task_for: req.body.add_task_for,
                    set_task_priority: req.body.set_task_priority,
                    reason_to_change_task_priority: req.body.reason_to_change_task_priority,
                    estimated_date: req.body.estimated_date,
                    reason_to_change_estimated_date: req.body.reason_to_change_estimated_date,
                    contact_source: req.body.contact_source,
                    selected_list: req.body.selected_list,
                    business_opportunity: req.body.business_opportunity,
                    sales_phase: req.body.sales_phase,
                    action: req.body.action,
                    action_date: req.body.action_date,
                    remarks: req.body.remarks,
                    assign_task_to: req.body.assign_task_to,
                    budget: req.body.budget,
                    client_firstName: req.body.client_firstName,
                    client_lastName: req.body.client_lastName,
                    client_contactNumber: req.body.client_contactNumber,
                    client_email: req.body.client_email,
                    level_of_urgency: req.body.level_of_urgency,
                    // task_status:req.body.task_status,
                    // is_completed:req.body.is_completed,
                    // note:req.body.note,
                    // reason_for_dealLost:req.body.reason_for_dealLost
                }
            })

            const userData = await Task.find(
                {
                    _id: req.params.id
                }
            )
            return userData;
        }).then(async ([userData]) => {
            console.log(userData);
            // Tweet.findOne({}, {}, { sort: { 'created_at' : -1 } }, function(err, post) {
            //     console.log( post );
            //   });
            await TaskHistory.findOneAndUpdate(
                { "task_id": req.params.id },
               
               {
                        sales_phase: userData.sales_phase,
                        action: userData.action, 
                        action_date: userData.action_date, 
                        remarks: userData.remarks,
                        assign_task_to: userData.assign_task_to, 
                        budget: userData.budget,
                        level_of_urgency: userData.level_of_urgency, 
                        // task_status:userData.task_status,
                        is_completed:req.body.is_completed,
                        note:req.body.note,
                        reason_for_dealLost: req.body.reason_for_dealLost,
                        next_action:req.body.next_action,
                      
                    },
                    {sort: { 'action_date' : -1 }}
                );
            const updateHistory = await TaskHistory.find(
                { task_id: req.params.id }
            );
            console.log(updateHistory);
            return {
                userData,
                updateHistory
            }
        }).then((data) => {
            res.send({
                msg: " update data successfully",
                data
            })
        }).catch(err => {
            console.log(err);
            res.status(500).send({
                msg: 'data not updated',
                err: err
            });
        })

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

// add note
const updateNote = async (req, res) => {
    try {
        let _promise = Promise.resolve();
        _promise.then(async () => {
            await Task.findByIdAndUpdate(
                {
                    _id: req.params.id
                }, {
                $set: {
                    subject: req.body.subject,
                    add_task_for: req.body.add_task_for,
                    set_task_priority: req.body.set_task_priority,
                    reason_to_change_task_priority: req.body.reason_to_change_task_priority,
                    reason_to_change_estimated_date: req.body.reason_to_change_estimated_date,
                    contact_source: req.body.contact_source,
                    selected_list: req.body.selected_list,
                    business_opportunity: req.body.business_opportunity,
                    sales_phase: req.body.sales_phase,
                    action: req.body.action,
                    remarks: req.body.remarks,
                    assign_task_to: req.body.assign_task_to,
                    budget: req.body.budget,
                    client_firstName: req.body.client_firstName,
                    client_lastName: req.body.client_lastName,
                    client_contactNumber: req.body.client_contactNumber,
                    client_email: req.body.client_email,
                    level_of_urgency: req.body.level_of_urgency,
                    
                }
            })

            const userData = await Task.find(
                {
                    _id: req.params.id
                }
            )
            return userData;
        }).then(async ([userData]) => {

            await TaskHistory.findOneAndUpdate(
                { "task_id": req.params.id },
               
               {
                        sales_phase: userData.sales_phase,
                        action: userData.action,  
                        remarks: userData.remarks,
                        assign_task_to: userData.assign_task_to, 
                        budget: userData.budget,
                        level_of_urgency: userData.level_of_urgency, 
                        // task_status:userData.task_status,
                        is_completed:req.body.is_completed,
                        note:req.body.note,
                        reason_for_dealLost: req.body.reason_for_dealLost,
                        next_action:req.body.next_action,
                      
                    },
                    {sort: { 'action_date' : -1 }}
                );
            const updateHistory = await TaskHistory.find(
                { task_id: req.params.id }
            );
            console.log(updateHistory);
            return {
                userData,
                updateHistory
            }
        }).then((data) => {
            res.send({
                msg: " update data successfully",
                data
            })
        }).catch(err => {
            console.log(err);
            res.status(500).send({
                msg: 'data not updated',
                err: err
            });
        })

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

// // edit Indivisual

// const editIndivisual=async(req,res)=>{
//     try{

//        const id=req.query.id;
//        const userData=await TaskHistory.findById({_id:id}).populate('sales_phase action assign_task_to');

//        if(userData){

//          res.status(200).send({success:true,task:userData})
       
//        }
//        else{
       
//         res.status(200).send({success:false})
//        }

//     }
//     catch(error){
//         res.status(400).send(error.message);
//     }
// }

// update individual
const updateIndivisual=async(req,res)=>{
    try{

       const userData= await TaskHistory.findByIdAndUpdate({_id:req.params.id,},
        {$set:
            {
                sales_phase:req.body.sales_phase,
                 action:req.body.action,
                 action_date:req.body.action_date,
                 remarks:req.body.remarks,
                 assign_task_to:req.body.assign_task_to,
                 reason_for_dealLost:req.body.reason_for_dealLost,
       }})
       res.status(200).send({sucess:true,msg:"sucessfully updated",task:userData})

    }
    catch(error){
        res.status(400).send(error.message);
    }
}


module.exports = {
    contactSource,
    sourceList,
    salesPhase,
    salesList,
    addAction,
    actionList,
    addTask,
    actionExist,
    taskList,
    editTask,
    updateTask,
    deleteTask,
    editSales,
    addnextAction,
    // editIndivisual,
    updateIndivisual,
    updateNote,
    deleteAction,
    updateAction,
    updateSales

}

// .then(async ([userData]) => {
//     console.log(userData);
//     await TaskHistory.findOneAndUpdate(
//         { "task_id": req.params.id },
//        {
//                 sales_phase: userData.sales_phase,
//                 action: userData.action, 
//                 action_date: userData.action_date, 
//                 remarks: userData.remarks,
//                 assign_task_to: userData.assign_task_to, 
//                 budget: userData.budget,
//                 level_of_urgency: userData.level_of_urgency, 
//                 task_status:userData.task_status
//                 // reason_for_dealLost: userData.reason_for_dealLost ? userData.reason_for_dealLost : ''
//             }
//         );
//     const updateHistory = await TaskHistory.find(
//         { task_id: req.params.id }
//     );
//     console.log(updateHistory);
//     return {
//         userData,
//         updateHistory
//     }
// }).then((data) => {
//     res.send({
//         msg: " update data successfully",
//         data
//     });
// }).catch(err => {
//     console.log(err);
//     res.status(500).send({
//         msg: 'data not updated',
//         err: err
//     });
// })

 
//    const taskCountData=await Task.findById({_id:req.params.id})
//    if(taskCountData.task_status<3)
//    {
//     const task_status=taskCountData.task_status+1;
//     const userData1= await Task.findByIdAndUpdate({_id:req.params.id},{$set:{task_status:task_status}});
//    }
    