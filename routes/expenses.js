const express = require('express');
const router = express.Router();
const Expense = require ('../models/expenses');
const Product = require('../models/product');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



//create new expenses:
const createExpense = router.post('/add', verifyToken, async (req, res, next) => {
    try {
      jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
          res.status(403).json({
            message: "Authentication failed, try to login"
          });
        } else {
          const expense = req.body;
          try {
            if (!expense.description || !expense.amount || !expense.paidby) {
              return res.status(400).json({ message: 'Please enter all fields' });
            }
  
            const newexpense = new Expense(expense);
            console.log(newexpense);
            await newexpense.save();
            res.status(201).json({ message: 'Expense created successfully', newexpense });
          } catch (error) {
            res.status(500).json({
              message: "Failed to create expense"
            });
          }
        }
      });
    } catch (err) {
      res.status(500).json({
        message: "Failed to create expense"
      });
    }
  });
  

//get expenses by id:
const getOneExpense = router.get('/:expensesId', verifyToken,async(req,res)=>{
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {

        const expense = await Expense.findById(req.params.expensesId);
        if(!expense){
            return rs.status(404).json({message:'expense not found'});
        }
        res.json(expense);
    
}})}
    catch(err){
        res.status(500).json({
            message: "Failed to get expense"
        });
    }
}   
);


//get all expenses:
const getAllExpense = router.get('/', verifyToken,async(req,res)=>{
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {
        const expenses =await Expense.find({});
        res.json(expenses);
}})}
    catch(err){
        res.status(500).json({
            message: "Failed to get expenses"
        });
    }
}
);



// add product to expense
const addProductToExpense = router.put('/:productId/:expenseId', verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {
                const product = await Product.findById(req.params.productId);
                if (!product) {
                    return res.status(404).json({ message: 'Product not found' });
                }
                const expense = await Expense.findById(req.params.expenseId);
                if (!expense) {
                    return res.status(404).json({ message: 'Expense not found' });
                }
                expense.products.push(product);
                await expense.save();
                res.json(expense);
            }
        });
    } catch(err){
        res.status(500).json({
            message: "Failed to add product to expense"
        });
    }
});

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
        res.json({message:'Expense deleted successfully'});

}});

const totalExpansesInGroup = router.get('/expenses/totalbygroup/:groupId',verifyToken, async(req,res)=>{
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {
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
catch(err){
    res.status(500).json({
        message: "Failed to get total expenses"
    });
}
}
);

const totalExpansesByUser = router.get('/expenses/totalbyuser/:userId',verifyToken, async(req,res)=>{
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {
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
catch(err){
    res.status(500).json({
        message: "Failed to get total expenses"
    });
}
}

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
    totalExpansesByUser,
    addProductToExpense
};
