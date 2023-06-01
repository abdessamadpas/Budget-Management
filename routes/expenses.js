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
const updateExpense = router.put('/update/:expensesId',verifyToken, async (req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
        const UpdatedExpense=req.body;
        const expense = new Expense(UpdatedExpense);
        const updateExpense = await Expense.findByIdAndUpdate(
            req.params.expensesId,
            expense,
            {new: true}
        );
        if(!UpdatedExpense){
            return  rs.status(404).json({message:'expense not found'});
        }
        res.json(updatedExpense);
   
}})});

//delete expense:
const  deleteExpense =router.delete('/delete/:expenseId',verifyToken,async(req,res)=>{
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

const totalExpansesInGroup = router.get('/expenses/totalbygroup/:groupId',verifyToken, async(req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
          const groupId = req.params.groupId;
            const total = await Expense.aggregate([
            {
                $match: {
                    group: groupId
                }
            },  {
                $group: {
                    _id: "$paiby",
                    amount: {
                        $sum: "$amount"
                    }
                }
            }
        ]);
        res.json(total);
    }
          
    })
}
);

const totalExpansesByUser = router.get('/expenses/totalbyuser/:userId',verifyToken, async(req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
            const userId = req.params.userId;
            const total = await Expense.aggregate([
            {
                $match: {
                    user: userId
                }
            },  {
                $group: {
                    _id: null,
                    amount: {
                        $sum: "$amount"

                    }

        }
    }])
    res.json(total);
}})}
);



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
    deleteExpense,
    totalExpansesInGroup,
    totalExpansesByUser
};
