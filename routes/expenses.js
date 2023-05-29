const express = require('express');
const router = express.Router();
const Expense = require ('../models/expenses');

//create new expenses:
router.post('/expenses', async(req,res)=>{
    try{
        const expense = req.body;
        const newexpense= new Expense(expense);
        await newexpense.save();
        res.status(201).json({message: 'Expense created succefully'});
    }catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to create expense'});
    }
});

//get expenses by id:
router.get('/expenses/:expensesId', async(req,res)=>{
    try{
        const expense = await Expense.findById(req.params.expensesId);
        if(!expense){
            return rs.status(404).json({message:'expense not found'});
        }
        res.json(expense);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Fails to get expense'});
    }
});

//get all expenses:
router.get('/expenses',async(req,res)=>{
    try{
        const expenses =await Expense.find({});
        res.json(expenses);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Failed to get all expenses'});
    }
});

//update expense:
router.put('/expenses/:expensesId', async (req,res)=>{
    try{
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
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Fails to update expense'});
    }
});

//delete expense:
router.delete('/expenses/:expenseId',async(req,res)=>{
    try{
        Expense.findByIdAndRemove({ _id: req.params.id }, (err,) => {
            if (err) next(err)
            res.status(200).json({
                message: "🪓 Expense Deleted 🧨"
            });
        });
        res.json({message:'Expense deleted successfully'});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Fails to delete expense'});
    }
});
module.exports =router;
//