const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config()

const auth = require('./routes/auth.js');
const expensesType = require('./routes/expensetype.js');
const product = require('./routes/product.js');
const group = require('./routes/group.js');
const expense = require('./routes/expenses.js');

const middlewares = require('./middlewares/errors');

// * middleware
const app = express();
app.use(express.json());
app.use(express.static('public'))
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));




// * routes auth
app.use('/auth', auth.singup); // todo done
app.use('/auth', auth.signIn); // todo done
app.use('/auth', auth.UpdateUser); //! needs testing
// app.use('/auth', auth.DeleteUser);//! needs testing
// app.use('/auth', auth.getAllUsers);//! needs testing
// app.use('/auth', auth.getUserById);//! needs testing

// * product routes
app.use('/product', product.createProduct); // todo done
app.use('/product', product.getAllProduct); // todo done
app.use('/product', product.getOneProduct); // todo done
app.use('/product', product.updateProduct); //! needs testing
app.use('/product', product.deleteProduct); //! needs testing

// * group routes
app.use('/group', group.createGroup); //! needs testing
//app.use('/group', group.getGroupById); //! needs testing
app.use('/group', group.deleteGroup); //! needs testing
app.use('/group', group.updateGroup); //! needs testing
app.use('/group', group.getAllGroups); //! needs testing
app.use('/group', group.addMemberToGroup); //! needs testing
app.use('/group', group.deleteMemberGroup); //! needs testing
app.use('/group', group.addExpenseToGroup); //! needs testing
//app.use('/group', group.getGroupById); //! needs testing
app.use('/group', group.getAllGroups);
app.use('/group', group.addMemberToGroup); //! needs testing
app.use('/group', group.addExpenseToGroup); //! needs testing

// * expenses routes
app.use('/expense', expense.createExpense);//! needs testing
app.use('/expense', expense.getAllExpense);//! needs testing
app.use('/expense', expense.getOneExpense);//! needs testing
app.use('/expense', expense.updateExpense);//! needs testing
app.use('/expense', expense.deleteExpense);//! needs testing

// * expensesType routes
app.use('/expensetype', expensesType.createExpense);
app.use('/expensetype', expensesType.getAllExpenseType);
// app.use('/reimbursement', require('./routes/reimbursement.js')); //! needs testing
// app.use('/expensetype', require('./routes/expensetype.js')); //! needs testing





app.get('/hello' , (req , res) => {
    res.json({
        message : " ❤️‍🔥🐉 Hello To my backend 🐉❤️‍🔥" ,
    });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


//* connection to mongoDB
const dbUrl = process.env.MONGO_URI
mongoose.connect(dbUrl)
    .then(() => {
        app.listen(process.env.PORT || 5000);
        console.log('\x1b[33m app connected to mongoDB! \x1b[0m');
    })
    .catch((err => {
        console.error(err)
    }))
