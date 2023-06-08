const express = require('express');
const router = express.Router();
const ExpenseType = require('../models/expensetype');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//create a new expense type:
const createExpense = router.post('/expensetype', async(req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
            const expensetype = req.body;
          
            if (!expensetype.name) {
               
                return res.status(400).json({ message: 'Please enter all fields' });
                };
            await ExpenseType.create(req.body).then((result) => {
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

//get all expense type:
const getAllExpenseType =router.get('/',verifyToken, async (req, res) => {
    
    jwt.verify(req.token, 'secretkey', async (err) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })

        } else {
            await ExpenseType.find({})
                .then((data) => {
                    res.status(200);
                    res.json({
                        expenetype: data,
                    })

                })
        }

    })

    
}
);

//get expensetype by id
const getoneExpenseType = router.get('/:Id', verifyToken,async(req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
        const expenetype = await ExpenseType.findById(req.params.Id);
        if(!expenetype){
            return rs.status(404).json({message:'expense not found'});
        }
        res.json(expenetype);
    
}})});

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

//update expense type
module.exports ={
    createExpense,
    getAllExpenseType,
    getoneExpenseType
};