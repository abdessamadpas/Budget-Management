const express = require('express');
const router = express.Router();
const Expense = require('../models/expenses.js');

const calculateReimbursementsInExpense  = router.get('/expense', async (req, res) => {
  try {
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
            $unwind: '$productsInfo',
        },
        {
            $project: {
              _id: 1,
                amount: 1,
                paiby:1,
              usersNumber: { $size: '$productsInfo.members' },
              description: 1,
               prodPrice: "$productsInfo.price",
                user: '$usersInfo.name',
                owedAmount: { $divide: ['$productsInfo.price', { $size: '$productsInfo.members' }] },

            },
          },
         
    ];

    const expenses = await Expense.aggregate(pipeline);
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = {
    calculateReimbursementsInExpense
};
