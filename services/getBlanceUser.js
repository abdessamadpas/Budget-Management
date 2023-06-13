const express = require('express');
const router = express.Router();
const Expense = require('../models/expenses.js');
const User  = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { $add, $subtract } = require('mongodb');

//! participation of user in expense

const getBalanceUser  = router.get('/balance/:userId',verifyToken, async (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })

        } else {
    try {
        

        const user = await User.find({_id:req.params.userId})
        if (!user) {
            res.status(404).json({ message: 'User not found' });
        }
        const idUser = user[0]._id;
        console.log(user);
        const pipeline = [
            {
            $lookup: { 
                from: 'products',
                localField: 'products',
                foreignField: '_id',
                as: 'productsInfo',
            },
            },
            {
                $unwind: '$productsInfo',
            },
            { $match: { $expr: { $gt: [ { $size: "$productsInfo.members" }, 1 ] } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'productsInfo.members',
                    foreignField: '_id',
                    as: 'usersInfo',
                    },
            },
            {
                $unwind: '$usersInfo',
            },
            {
                $project: {
                    _id: 1,
                    amount: 1,
                    expense: "$_id",
                    paiby:1,
                    usersNumber: { $size: '$productsInfo.members' },
                    description: 1,
                    prodPrice: "$productsInfo.price",
                    user: '$usersInfo._id',
                    owedAmount: { $divide: ['$productsInfo.price', { $size: '$productsInfo.members' }] },
                },
            },
          
            {   
                $group: {
                    _id: '$user',
                    totalOwedAmount: { $sum: '$owedAmount' },
                    usersNumber: { $first: '$usersNumber' },
                    description: { $first: '$description' },
                    prodPrice: { $first: '$prodPrice' },
                    expense: { $first: '$expense' },
                    // _id:{ $first: '$_id' },
                    // ExpensePrice: "{$productsInfo.price}",
                    // totalUsers: { $sum: 1 },
                    PaidBy: {$first : '$paiby' },
                
                },
            },  
            {
                $project: {
                    _id: 1,
                    totalOwedAmount: 1,
                    usersNumber: 1,
                    description: 1,
                    prodPrice: 1,
                    PaidBy:1,
                    expense:1,
                    // ExpensePrice: 1,
                }
            },
            {
                $match: {
                  _id: idUser,
                },
            },
            {
                
                $project: {
                    _id: 1,
                    balance: { $add: ['$totalOwedAmount', user[0].balance] }, 
                  },
            },
           
        ];

        const expenses = await Expense.aggregate(pipeline);
        res.json(expenses);
    } catch (err) {
    res.status(500).json({ message: err.message });
  }}})
});

//verify token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(403)
        next({
            message: "Forbidden you have to login first bro😪🥱"
        })
    }

}



module.exports = {
    getBalanceUser
};
