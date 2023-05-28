const express = require('express');
const router = express.Router();
const Group = require ('../models/group');

//create new group:
router.post('/group', async(req, res)=>{
    try{
        const {members, expenses, reimbursement}= req.body;
        //passer en tant qu'argument por initialiser la new instance 
        const newGroup = new Group({
            members,
            expenses,
            reimbursement,
        });
        //save in the db
        await newGroup.save();
        //succes
        res.status(201).json({message: 'Group created succefully'});
    //error
    }catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to create group'});
    }
    
});

//get group by id:
router.get('/group/:groupId', async(req,res) => {
    try{
        //req.params.groupId extrait la valeur de userId
        const group = await Group.findById(req.params.groupId);
        //group not found
        if(!group){
            return rs.status(404).json({message:'group not found'});
        }
        res.json(group);  //trouvé donc il va être renvoyé en tant que format json avec 200 ok      
    //erreur
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Fails to get group'});
    }
});

//get all groups:
router.get('/group', async (req, res) => {
    try{
        const groups = await Group.find({});
        res.json(groups); 
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Failed to get all groups'});
    }
})

//update group:
router.put ('/group/:groupId', async (req,res)=>{
    try{
        const {members, expenses, reimbursement}= req.body;
        const updateGroup = await Group.findByIdAndUpdate(
            req.params.groupId, 
            {members,expenses, reimbursement},
            {new: true}//document mise à jour (db)
        );
        if(!updateGroup){
           return rs.status(404).json({message:'group not found'});
        }
        res.json(updateGroup);
    } catch(err){
        console.error(err);
        res.status(500).json({message: 'Fails to update group'});
    }
});


//delete group:
router.delete('/group/:groupId', async (req,res) => {
    try{
        // const deleteGroup= await Group.findByIdAndDelete(req.params.groupId);
        // if(!deleteGroup){
        //     return rs.status(404).json({message:'group not found'});
        group.findByIdAndRemove({ _id: req.params.id }, (err,) => {
            if (err) next(err)
            res.status(200)
            res.json({
                message: "🪓 Group Deleted 🧨"
            });
        });
        res.json({message:'Group deleted successfully'});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Fails to delete group'});
    }
})