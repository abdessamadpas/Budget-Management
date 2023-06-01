const express = require('express');
const router = express.Router();
const Expense = require ('../models/expenses');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



//create new expenses:
const createExpense = router.post('/add',verifyToken, async(req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
            const expense = req.body;
            const newexpense= new Expense(expense);
            await newexpense.save();
            res.status(201).json({message: 'Expense created succefully'});
 
}
    })});

//get expenses by id:
const getOneExpense = router.get('/:expensesId', verifyToken,async(req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{

        const expense = await Expense.findById(req.params.expensesId);
        if(!expense){
            return rs.status(404).json({message:'expense not found'});
        }
        res.json(expense);
    
}})});

//get all expenses:
const getAllExpense = router.get('/', verifyToken,async(req,res)=>{
  jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{

        const expenses =await Expense.find({});
        res.json(expenses);

  
}})});

//update expense:
const updateExpense = router.put('/:expensesId', verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {
                const updatedExpense = req.body;
                const updateExpense = await Expense.findByIdAndUpdate( 
                    req.params.expensesId,
                    updatedExpense,
                    { new: true }
                );
                if (!updateExpense) {
                    return res.status(404).json({ message: 'expense not found' });
                }
                res.json(updateExpense);
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to update expense"
        });
    }
});

//delete expense:
const deleteExpense = router.delete('/:Id', verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {
                await Expense.findByIdAndRemove(req.params.Id);
                res.status(200).json({
                    message: "🪓 Expense Deleted 🧨"
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete expense"
        });
    }
});
//verify token:
  function verifyToken  (req, res, next){
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
    createExpense,
    getOneExpense,
    getAllExpense,
    updateExpense,
    deleteExpense
};
//