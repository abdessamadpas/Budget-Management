const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const User = require('../models/user'); 
const calculateReimbursementsInProduct= router.get('/product', async (req,res)=> {
  try {

    const pipeline = [
      { $match: { $expr: { $gt: [ { $size: "$members" }, 1 ] } } }
      ,
      {
        $lookup: {
          from: 'users',
          localField: 'members',
          foreignField: '_id',
          as: 'usersInfo',
        },
      },
          { $unwind: '$usersInfo' },
          {
            $project: {
              _id: 1,
              name: 1,
              price: 1,
              usersNumber: { $size: '$members' },
              description: 1,
              expense: 1,
              category: 1,
              usersInfo: {
                name: 1,
              },
            },
          },
          // {
          //   $group: {
          //     _id: '$expense',
              
          //     totalUsers: { $size: "$members" },
          //   },
          // },

      // {
      //   $group: {
      //     _id: '$paidBy',
      //     totalUsers: { $first: '$usersInfo.count' },
      //   },
      // },
      // { $match: { totalExpenses: { $gt: 0 } } },

      {
        $project: {
          _id: 0,
          user: '$usersInfo.name',
          owedAmount: { $divide: ['$price', '$usersNumber'] },
        },
      },
    ];


    const result = await Product.aggregate(pipeline);

    console.log(result);
    res.json(result);

  } catch (err) {
    console.error('An error occurred:', err);
  }
}
);

module.exports = {calculateReimbursementsInProduct};