const express = require('express');
const router = express.Router();
const Group = require ('../models/group');
const User = require ('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//  create new group:
 const createGroup = router.post('/',verifyToken  ,async(req, res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
            await Group.create(req.body).then((result) => {
                res.status(200)
                res.json({
                    result,
                })
            }
            ).catch((err) => res.json({
                error: err.message
            }))

        }
    })
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
const getAllGroups = router.get('/', verifyToken, async (req, res) => {
    
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })

        } else {
        await Group.find().sort().populate("members").then((result) => {
                res.status(200);
                res.json({
                    groups: result,
                })
            }).catch((err) => res.json({
                error: err.message
            }))
        }
    })

});
const addMemberToGroup = router.put('/:groupId/members/:userId',verifyToken ,async(req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {  
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
            const groupId = req.params.groupId;
            const userId = req.params.userId;
            const currentgroup = await Group.findById(groupId);
            currentgroup.members.push(userId);
            await Group.updateOne({_id: groupId}, currentgroup, (err, result) => {
                if (err) {
                    res.status(500).json({
                        message: "Failed to add member to group 😢"
                        })
                        } else {
                            res.status(200).json({
                                message: "Member added to group successfully 🎉"
            })}})
        }
    })
}
);

const addExpenseToGroup = router.put('/:groupId/expenses/:expenseId',verifyToken ,async(req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {  
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
            const groupId = req.params.groupId;
            const expenseId = req.params.expenseId;
            const currentGroup = await Group.findById(groupId);
            currentGroup.expenses.push(expenseId);
            await Group.updateOne({_id: groupId}, currentGroup, (err, result) => {
                if (err) {
                    res.status(500).json({
                        message: "Failed to add expense to group 😢"
                        })
                        } else {
                            res.status(200).json({
                                message: "Expense added to group successfully 🎉"
            })}})
        }
    })
}
);

                              

            
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

function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];

        // Set the token

        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.status(403)
        next({
            message: "Forbidden you have to login first bro"
        })
    }

}

module.exports ={
  createGroup,
    getAllGroups,
    addMemberToGroup,
    addExpenseToGroup
};