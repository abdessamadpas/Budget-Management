const express = require('express');
const router = express.Router();
const Expense = require('../models/expenses.js');
const User = require('../models/user.js');
const Product = require('../models/product.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createExpenseWithProducts = router.post('/createExpenseWithProducts', verifyToken, async (req, res) => {
  try {
    jwt.verify(req.token, 'secretkey', async (err) => {
      if (err) {
        res.status(403).json({
          message: "Authentication failed, please try to log in."
        });
      } else {
        const { description, amount, paiby, products ,Group} = req.body;

        // Check if all required fields are present
        if (!description || !amount || !paiby || !products) {
          return res.status(400).json({ message: 'Please enter all fields' });
        }

        // Create a new expense document
        const expense = new Expense({
          description,
          amount,
          paiby,
          Group,
          products: [] // To store product IDs associated with the expense
        });

        // Create product documents and associate them with the expense
        for (const productData of products) {
          const product = new Product(productData);
          await product.save();
          expense.products.push(product._id);
        }

        // Save the expense document
        await expense.save();

        // Return the newly created expense document
        res.status(201).json(expense);
      }
    });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ message: 'An error occurred while creating the expense.' });
  }
});

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
    res.status(403).json({
      message: "Forbidden, you have to log in first."
    });
  }
}

module.exports = {
  createExpenseWithProducts,
};