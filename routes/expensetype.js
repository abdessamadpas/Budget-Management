const express = require('express');
const router = express.Router();
const ExpenseType = require('../models/expensetype');

//create a new expense type:
router.post('/expensetype', async(req,res)=>{
    try{
        const expensetype = req.body;
        const newexptype = new ExpenseType(expensetype);
        await newexptype.save();
        res.status(201).json({message: 'Expence type created succefully'});
    }catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to create expense type'});
    }
});

//get all expense type:
router.get('/expensetype', async(req,res)=>{
    try{
        const expenetypes = await ExpenseType.find({});
        res.json(expenetypes);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Failed to get all expense type'});
    }
});

//update expense type
module.exports =router;