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
            const group = req.body;
            if (!group.name) {
               
                return res.status(400).json({ message: 'Please enter all fields' });
                };
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
const getGroupById = router.get('/:groupId', verifyToken,async(req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
            const group = await Group.findById(req.params.groupId);
            if(!group){
                return res.status(404).json({message:'expense not found'});
            }
            res.json(group);
    
}})});

//get all groups:
const getAllGroups = router.get('/', verifyToken, async (req, res) => {
    
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })

        } else {
        await Group.find().sort().populate([ "members",{

            path: 'expenses',
            populate: {
                path: 'products',
                populate: {
                    path: 'category',
                }
            }

        }]).then((result) => {
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


//add member to group:
const addMemberToGroup = router.put('/:groupId/members/:userId', verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, please try to login"
                });
            } else {
                const groupId = req.params.groupId;
                const userId = req.params.userId;
                const currentgroup = await Group.findById(groupId);
                if (currentgroup.members.includes(userId)) {
                    res.status(400).json({
                        message: "Member already exists in group"
                    });
                }
                currentgroup.members.push(userId);
                await Group.updateOne({ _id: groupId }, { $set: currentgroup });
                res.status(200).json({
                    message: "Member added to group successfully 🎉"
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to add a member to group 😢"
        });
    }
});


//add expense to group:
const addExpenseToGroup = router.put('/:groupId/expenses/:expenseId', verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, please try to login"
                });
            } else {
                const groupId = req.params.groupId;
                const expenseId = req.params.expenseId;
                const currentgroup = await Group.findById(groupId);
                console.log(currentgroup);
                currentgroup.expenses.push(expenseId);
                await Group.updateOne({ _id: groupId }, { $set: currentgroup });
                res.status(200).json({
                    message: "Expense added to group successfully 🎉"
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to add a expense to group 😢"
        });
    }
});                            

            
//update group:
const updateGroup = router.put('/:groupId', verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {
                const updatedGroup = req.body;
                const updateGroup = await Group.findByIdAndUpdate( //il ne faut pas cree une nouvelle instance, elle est modifier automatiquement
                    req.params.groupId,
                    updatedGroup,//hna kouna dayrine group normalement khasna ndiro update group
                    { new: true }
                );
                if (!updateGroup) {
                    return res.status(404).json({ message: 'Group not found' });
                }
                res.json(updateGroup);
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to update group"
        });
    }
});


//delete group:
const deleteGroup = router.delete('/:Id', verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {
                await Group.findByIdAndRemove(req.params.Id);
                res.status(200).json({
                    message: "🪓 Group Deleted 🧨"
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete group"
        });
    }
});

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
    getGroupById,
    addMemberToGroup,
    addExpenseToGroup,
    deleteMemberGroup,
    deleteGroup,
    updateGroup
};