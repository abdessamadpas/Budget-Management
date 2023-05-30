const express = require('express');
const router = express.Router();
const Group = require ('../models/group');
const User = require ('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//  create new group:
 const createGroup = router.post('/add',verifyToken  ,async(req, res)=>{
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
                        message: "Failed to add a member to group 😢"
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
const updateGroup = router.put ('/:groupId', verifyToken,async (req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {  
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
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
   
}})});


//delete group:
const deleteGroup = router.delete('/:groupId', verifyToken,async (req,res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {  
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
        Group.findByIdAndRemove({ _id: req.params.id }, (err,) => {
            if (err) next(err)
            res.status(200).json({
                message: "🪓 Group Deleted 🧨"
            });
        });
        res.json({message:'Group deleted successfully'});
  
}})});

//delete user from group:
const deleteMemberGroup = router.delete('/:groupId/members/:userId',verifyToken, async(req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {  
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
        const groupId = req.params.groupId;
        const userId = req.params.userId;
        const group = await Group.findById(groupId);
        const user = await User.findById(userId);
        if(!group || !user){
            return res.status(404).json({error: 'Group or User not found'});
        }
        const index = group.members.indexOf(userId);
        if(index !== -1){ 
            group.members.splice(index,1);
            await group.save();
        }
        return res.json({ message: 'user removed succesfully from the group'});
    }
})});

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
    addExpenseToGroup,
    deleteMemberGroup,
    deleteGroup,
    updateGroup
};