
const express = require('express');
const router = express.Router();
const Expense = require('../models/expenses.js');
const User  = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//! web socket 

const expenseSocket = router.get('/expense/watch', (req, res) => {
    const io = req.app.get('socketio');
    const socket = io.of('/expense-watch');
    socket.on('connection', (clientSocket) => {
      console.log('connected for expense watching');

  
      Expense.watch().on('change', (change) => {
        if (change.operationType === 'insert') {
          const newExpense = change.fullDocument;
          clientSocket.emit('expensesUpdated', newExpense);
        }
      });
      clientSocket.on('disconnect', () => {
        console.log('disconnected from expense watching');
        changeStream.close();
      });
    });
  
    res.send('Expense watching started');
  });

module.exports = {
    expenseSocket
};



