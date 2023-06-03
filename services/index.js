const mongoose = require('mongoose');

const Product = require('../models/product');

const calculateReimbursements= route.get('/', async (req,res)=> {
  try {

    const pipeline = [
      { $match: { users: { $gt: 1 } } },
      
      {
        $lookup: {
          from: users,
          localField: 'members',
          foreignField: '_id',
          as: 'usersInfo',
        },
      },
      
      { $unwind: '$usersInfo' },
      
      // {
      //   $group: {
      //     _id: '$paidBy',
      //     totalExpenses: { $sum: '$amount' },
      //     totalUsers: { $first: '$usersInfo.count' },
      //   },
      // },
      
      // { $match: { totalExpenses: { $gt: 0 } } },
      
      // {
      //   $project: {
      //     _id: 0,
      //     user: '$_id',
      //     owedAmount: { $divide: ['$totalExpenses', '$totalUsers'] },
      //   },
      // },
    ];


    const result = await Product.aggregate(pipeline);

    console.log(result);

  } catch (err) {
    console.error('An error occurred:', err);
  }
}
);

module.exports = {calculateReimbursements};