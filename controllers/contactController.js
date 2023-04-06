
const Group = require('../models/tbl_group');
const Contact = require('../models/tbl_contacts');
const randomstring = require('randomstring');
const config = require("../config/config");
// const nodemailer=require('nodemailer');
const jwt = require('jsonwebtoken');
const Country = require('../models/country');
const State = require('../models/state');
const City = require('../models/city');
const GroupContact = require('../models/tbl_groupContact');
const ContactManagement = require('../models/tbl_contactManagement');
const csv = require('csvtojson')

const getCountries = async (req, res) => {
    try {
        const countries = await Country.find({})
        res.status(200).send(countries)
    }
    catch (error) {
        res.status(400).send({ msg: error.message })
    }
}

const getStates = async (req, res) => {
    try {
        const states = await State.find({ country_short_name: req.body.country_short_name })
        res.status(200).send(states)
    }
    catch (error) {
        res.status(400).send({ msg: error.message })
    }
}

const getCities = async (req, res) => {
    try {
        const cities = await City.find({ state_name: req.body.state_name })
        res.status(200).send(cities)
    }
    catch (error) {
        res.status(400).send({ msg: error.message })
    }
}




// add contact
const addContact = async (req, res) => {
    try {

        const contact = new ContactManagement({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            designation: req.body.designation,
            company_name: req.body.company_name,
            primary_contact_number: req.body.primary_contact_number,
            secondary_contact_number: req.body.secondary_contact_number,
            email: req.body.email,
            group: req.body.group,
            contact_source:req.body.contact_source,
            buisness_sector:req.body.buisness_sector,
            status: req.body.status,
            address1: req.body.address1,
            address2: req.body.address2,
            taluka: req.body.taluka,
            village: req.body.village,
            zipcode: req.body.zipcode,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            type: req.body.type

        })

        const userData = await contact.save().then(async (userData) => {
            for (var i = 0; i < userData.group.length; i++) {
                const all = new GroupContact({
                    contact_id: userData._id,
                    group_id: userData.group[i]

                })
                const historyData = await all.save()
                // console.log(historyData)
                const groupCountData = await Group.findById({ _id: req.body.group[i] })
                const count = groupCountData.count + 1;
                const userData1 = await Group.findByIdAndUpdate({ _id: req.body.group[i] }, { $set: { count: count } });
            }
        });
        if (userData) {
            res.status(200).send({ success: true, data: userData, msg: "Data save successfully." })

        }
        else {
            res.status(200).send({ msg: "contact data failed" })
        }
    }
    catch (error) {

        res.status(400).send(error.message);
    }

}

// email exist

const emailExist = async (req, res) => {

    try {

        ContactManagement.find({ email: req.query.email })
            .then(async resp => {
                if (resp.length != 0) {
                    return res.status(200).send({ success: false, msg: 'Email alredy exist' })

                } else {
                    return res.status(200).send({ success: true, msg: 'Email not exist' })
                }
            })

    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

// contact exist

const contactExist = async (req, res) => {

    try {

        ContactManagement.find({ primary_contact_number: req.query.primary_contact_number })
            .then(async resp => {
                if (resp.length != 0) {
                    return res.status(200).send({ success: false, msg: 'contact alredy exist' })

                } else {
                    return res.status(200).send({ success: true, msg: 'contact not exist' })
                }
            })

    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

// all contact list

const allContact = async (req, res) => {
    try {

        const userData = await ContactManagement.find({ type: 'contact' });
        res.status(200).send({ success: true, data: userData });

    }
    catch (err) {
        res.status(400).send(err.message);
    }
}
const common = async (req, res) => {
    try {

        const userData = await ContactManagement.find().populate('group');
        res.status(200).send({ success: true, data: userData });

    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

// contact list
const contactList = async (req, res) => {
    try {
        var sortObject = {};
        var stype = req.query.sorttype ? req.query.sorttype : 'createdAt';
        var sdir = req.query.sortdirection ? req.query.sortdirection : -1;
        sortObject[stype] = sdir;

        var search = '';
        if (req.query.search) {
            search = req.query.search
        }

        const pageNumber = parseInt(req.query.pageNumber) || 0;
        const limit = parseInt(req.query.limit) || 4;
        const result = {};
        const totalPosts = await ContactManagement.countDocuments({ type: 'contact' }).exec();
        let startIndex = pageNumber * limit;
        const endIndex = (pageNumber + 1) * limit;
        result.totalPosts = totalPosts;
        if (startIndex > 0) {
            result.previous = {
                pageNumber: pageNumber - 1,
                limit: limit,
            };
        }
        if (endIndex < (await ContactManagement.countDocuments({ type: 'contact' }).exec())) {
            result.next = {
                pageNumber: pageNumber + 1,
                limit: limit,
            };
        }
        result.data = await ContactManagement.find({ type: 'contact' })
            .populate('group contact_source buisness_sector')
            .find({
                $or: [
                    { first_name: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { email: { $regex: '.*' + search + '.*', $options: 'i' } },
                    { primary_contact_number: { $regex: '.*' + search + '.*', $options: 'i' } },
                ]
            })
            .sort(sortObject)
            .skip(startIndex)
            .limit(limit)
            .exec();
        result.rowsPerPage = limit;
        return res.send({ msg: "Posts Fetched successfully", data: result });

    }

    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Sorry, something went wrong" });
    }
}


// delete contact
const deleteContact = async (req, res) => {

    try {
        const id = req.query.id;
        const userData = await ContactManagement.deleteOne({ _id: id });
        const deleteContact = await GroupContact.deleteMany({ contact_id: id });
        res.status(200).send({ success: true, msg: "Contact can be deleted" })


    }
    catch (err) {
        res.status(400).send(err.message)
    }
}

// contact edit & update

const editContact = async (req, res) => {
    try {

        const id = req.query.id;

        const userData = await ContactManagement.findById({ _id: id }).populate('group contact_source buisness_sector');

        if (userData) {

            res.status(200).send({ success: true, contact: userData })

        }
        else {

            res.status(200).send({ success: false })
        }

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

// update profile

const updateContact = async (req, res) => {
    try {

        const userData = await ContactManagement.findByIdAndUpdate({ _id: req.params.id },
            {
                $set:
                {
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    designation: req.body.designation,
                    company_name: req.body.company_name,
                    primary_contact_number: req.body.primary_contact_number,
                    secondary_contact_number: req.body.secondary_contact_number,
                    email: req.body.email,
                    group: req.body.group,
                    business_opportunity: req.body.business_opportunity,
                    status: req.body.status,
                    address1: req.body.address1,
                    address2: req.body.address2,
                    taluka: req.body.taluka,
                    village: req.body.village,
                    zipcode: req.body.zipcode,
                    city: req.body.city,
                    state: req.body.state,
                    country: req.body.country
                }
            }).then(async (userData) => {
                const id = userData._id;
                const userData1 = await GroupContact.deleteMany({ contact_id: id });
                return userData;

            }).then(async (userData) => {
                for (var i = 0; i < req.body.group.length; i++) {
                    const all = new GroupContact({
                        contact_id: req.params.id,
                        group_id: req.body.group[i]

                    })
                    const data = await all.save()
                }
            });


        res.status(200).send({ sucess: true, msg: "sucessfully updated", group: userData })

    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

// import user
const importUser = async (req, res) => {
    try {
        const errorArray = [];
        var userData = [];
        var updateData = [];
        let updatedArray  = [];
        let insertedArray =   [];

        csv()
            .fromFile(req.file.path)
            .then(async (response) => {

                let  listUpdated =  response.map(async (data) => {
                    const _data = {
                        first_name: data.first_name,
                        last_name: data.last_name,
                        designation: data.designation,
                        company_name: data.company_name,
                        email: data.email,
                        secondary_contact_number: data.secondary_contact_number,
                        primary_contact_number: data.primary_contact_number,
                        group: data.group,
                        business_opportunity: data.business_opportunity,
                        service_offered: data.service_offered,
                        status: data.status,
                        address1: data.address1,
                        address2: data.address2,
                        taluka: data.taluka,
                        village: data.village,
                        zipcode: data.zipcode,
                        city: data.city,
                        state: data.state,
                        country: data.country,
                        type: data.type,
                    }

                    const exist = await ContactManagement.findOne({ email: _data.email });
                   
                    if (exist) {
                        // _data._id = exist._id;
                        if (exist.primary_contact_number === _data.primary_contact_number) {
                            const updateddata  = await ContactManagement.findByIdAndUpdate({ _id: exist._id },
                                { $set: _data });
                                console.log('updateddata' , updateddata)
                                updatedArray.push(updateddata);
                        } else {
                            console.log('update' , exist._id)
                            _data.primary_contact_number =  data.primary_contact_number; 
                            const updateddata  = await ContactManagement.findByIdAndUpdate({ _id: exist._id },
                                { $set: _data });
                                console.log('updateddata' , updateddata)
                                updatedArray.push(updateddata);
                        }

                    } else {
                        const exist = await ContactManagement.findOne({ primary_contact_number: data.primary_contact_number });
                        if (exist) {
                           errorArray.push({ dublicate: true, primary_contact_number: data.primary_contact_number })
                           return;
                        } else {
                            _data.primary_contact_number =  data.primary_contact_number;  
                            const contact = new ContactManagement(_data)
                           let svedData =  await contact.save();
                            insertedArray.push(svedData);
                        }
                    }
                    userData.push(_data);
                    // console.log(exist);

                })

                Promise.all(listUpdated).then((data)=> {
                    if(errorArray.length > 0) {
                        res.send({ success: true, msg: "CSV imported", total: userData.length, errorArray, updatedArray, insertedArray})
                    }
                    
                })
                
               
                //  const emails = userData.map(({email}) => email)
                //  const  existArray = await ContactManagement.exists(emails);
                //  console.log(existArray);
                //  await ContactManagement.insertMany(userData, { ordered: false })

            }).catch(error => {
                res.send({ success: false, msg: error.message, error: error, unsucessfull: error.writeErrors.length, sucessfull: error.insertedDocs.length, total: userData.length })

            })



    } catch (error) {
        res.send({ success: false, msg: error.message, error: error })
    }
}

module.exports = {

    addContact,
    contactList,
    deleteContact,
    editContact,
    updateContact,
    getCountries,
    getStates,
    getCities,
    emailExist,
    contactExist,
    allContact,
    common,
    importUser
}