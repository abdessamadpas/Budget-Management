const express = require('express');
const router = express.Router();
const Expense = require('../models/expenses.js');
const User  = require('../models/user.js');
const Group  = require('../models/group.js');
const jwt = require('jsonwebtoken');


//! participation of user in expense

const groupByUser  = router.get('/group/:userId',verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })

        } else {
            const user = await User.find({_id:req.params.userId})
            console.log(user);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
            }
            const pipeline = [
                {
                $lookup: {
                    from: 'users',
                    localField: 'members',
                    foreignField: '_id',
                    as: 'usersInfo',
                    },
                },{
                    $unwind: '$usersInfo',
                },
                {
                    $match: { $expr: { $eq: [ "$usersInfo._id", user[0]._id ] } }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        balance: 1,
                       members: 1,
                    },
                },
                
                ]
            const groups = await Group.aggregate(pipeline);
            res.status(200).json(groups)
   
        }})
});

//verify token
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
            message: "Forbidden you have to login first bro😪🥱"
        })
    }

}



module.exports = {
    groupByUser
};
