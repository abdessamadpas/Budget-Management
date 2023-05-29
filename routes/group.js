const express = require('express');
const router = express.Router();
const Group = require ('../models/group');

//  create new group:
router.post('/group', async(req, res)=>{
    try{
        const group= req.body;
        const newGroup = new Group(group);
        await newGroup.save();
        res.status(201).json({message: 'Group created succefully'});
    }catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to create group'});
    }
    
});

//  get group by id:
router.get('/group/:groupId', async(req,res) => {
    try{
        const group = await Group.findById(req.params.groupId);
        if(!group){
            return rs.status(404).json({message:'group not found'});
        }
        res.json(group);  
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
        const UpdatedGroup= req.body;
        const group = new Group(UpdatedGroup);
        const updateGroup = await group.findByIdAndUpdate(
            req.params.groupId, 
            group,
            {new: true}
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
       
        group.findByIdAndRemove({ _id: req.params.id }, (err,) => {
            if (err) next(err)
            res.status(200).json({
                message: "🪓 Group Deleted 🧨"
            });
        });
        res.json({message:'Group deleted successfully'});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Fails to delete group'});
    }
})



// delete user from group