const express = require('express');
const router = express.Router();
const Expense = require('../models/expenses.js');
const User  = require('../models/user.js');
const Product = require('../models/product.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');



const createExpenseWithProducts = router.post('/createExpenseWithProducts',verifyToken, async (req, res) => {

    jwt.verify(req.token, 'secretkey', async (err) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })

        } else {
           
   
            // console.log(req.body);
             if (!req.body.description || !req.body.amount || !req.body.paiby) {
               
                return res.status(400).json({ message: 'Please enter all fields' });
                };
          
          
                //  console.log(expense);
            const expense ={
                description: req.body.description,
                amount: req.body.amount,
                paiby: req.body.paiby,
                products: []    
            };
            const expenseId = "";
            const newexpense= new Expense(expense);
            await newexpense.save().then((expense) => {
expenseId = expense._id.toString();
            })
                    
           
                const products = req.body.products;
                products.map(async (product) => {
                    await Product.create(product).then(async(result) => {
                       
                        newexpense.products.push(result._id.toString());
                        await Expense.findByIdAndUpdate( 
                            expenseId,
                            newexpense,
                            { new: true }
                        );;
                            

            //            expense.products.push(result._id.toString());
                 
                    })
            }
            )



       
                 
            //    await newexpense.save().then((expense) => {
              
            //     res.status(200).json({
            //         message: " expense done",
            //         expense: expense
            //     })
            // }
            // ).catch((err) => res.json({
            //     error: err.message
            // }))
            
             


           
             
            
            
        }

            
            
    })
})

  




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






module.exports = {
    createExpenseWithProducts,
};
