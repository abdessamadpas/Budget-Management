const express = require('express');
const router = express.Router();
const Expense = require ('../models/expenses');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



//create new expenses:
const createExpense = router.post('/expenses',verifyToken, async(req,res)=>{
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
const getOneExpense = router.get('/expenses/:expensesId', verifyToken,async(req,res)=>{
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
const getAllExpense = router.get('/expenses', verifyToken,async(req,res)=>{
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
const updateExpense = router.put('/expenses/:expensesId',verifyToken, async (req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
        const UpdatedExpense=req.body;
        const expense = new Expense(UpdatedExpense);
        const updateExpense = await expense.findByIdAndUpdate(
            req.params.expensesId,
            expense,
            {new: true}
        );
        if(!UpdatedExpense){
            return  rs.status(404).json({message:'expense not found'});
        }
        res.json(UpdatedExpense);
   
}})});

//delete expense:
const  deleteExpense =router.delete('/expenses/:expenseId',verifyToken,async(req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
        Expense.findByIdAndRemove({ _id: req.params.id }, (err,) => {
            if (err) next(err)
            res.status(200).json({
                message: "🪓 Expense Deleted 🧨"
            });
        });
        res.json({message:'Expense deleted successfully'});

}})});
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