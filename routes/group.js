const express = require('express');
const router = express.Router();
const Group = require ('../models/group');
const User = require ('../models/user');

//  create new group:
router.post('/', async(req, res)=>{
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
router.get('/:groupId', async(req,res) => {
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
router.get('/', async (req, res) => {
    try{
        const groups = await Group.find({});
        res.json(groups); 
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Failed to get all groups'});
    }
});

//update group:
router.put ('/:groupId', async (req,res)=>{
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
router.delete('/:groupId', async (req,res) => {
    try{
        Group.findByIdAndRemove({ _id: req.params.id }, (err,) => {
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
});

//delete user from group:
router.delete('/:groupId/members/:userId', async(req,res)=>{
    try{
        const groupId = req.params.groupId;
        const userId = req.params.userId;
        //touver le groupe selon id:
        const group = await Group.findById(groupId);
        //touver l'utilisateur selon id:
        const user = await User.findById(userId);
        //verification d'exsistence user ou group:
        if(!group || !user){
            return res.status(404).json({error: 'Group or User not found'});
        }
        //suppression de user from group: 'splice(startIndex, nmb of element to delete, replaceitem1)'
        const index = group.members.indexOf(userId);
        if(index !== -1){ //"-1" means element not found
            group.members.splice(index,1);
            await group.save();
        }
        return res.json({ message: 'user removed succesfully from the group'});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Fails to delete user from group'});
    }
});

module.exports =router;