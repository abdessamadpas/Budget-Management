const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');


const auth = require('./routes/auth.js');
const expensesType = require('./routes/expensetype.js');
const product = require('./routes/product.js');
const group = require('./routes/group.js');
const middlewares = require('./middlewares/errors');
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(express.static('public'))
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));




//! routes

// app.use('/user', require('./routes/user.js'));
// app.use('/expenses', require('./routes/expenses.js'));
// app.use('/auth', require('./routes/auth.js'));
//  app.use('/group', require('./routes/group.js'));
app.use('/auth', auth.singup); // todo done
app.use('/auth', auth.signIn); // todo done
app.use('/auth', auth.UpdateUser); 
// app.use('/auth', auth.DeleteUser);
// app.use('/auth', auth.getAllUsers);
// app.use('/auth', auth.getUserById);
app.use('/product', product.createProduct); // todo done
app.use('/product', product.getAllProduct); // todo done
app.use('/product', product.getOneProduct); // todo done
app.use('/product', product.updateProduct); 
app.use('/product', product.deleteProduct); 
app.use('/group', group.createGroup);	
app.use('/group', group.getAllGroups);
app.use('/group', group.addMemberToGroup); //! needs testing
app.use('/group', group.addExpenseToGroup); //! needs testing

app.use('/expensetype', expensesType.createExpense);
app.use('/expensetype', expensesType.getAllExpenseType);

// app.use('/reimbursement', require('./routes/reimbursement.js'));
// app.use('/expensetype', require('./routes/expensetype.js'));





app.get('/hello' , (req , res) => {
    res.json({
        message : " ❤️‍🔥🐉 Hello To my backend 🐉❤️‍🔥" ,
    });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);



//! connection to mongoDB
 //connectionDB() ;

const dbUrl = process.env.MONGO_URI
mongoose.connect(dbUrl)
    .then(() => {
        app.listen(process.env.PORT || 5000);
        console.log('\x1b[33m app connected to mongoDB! \x1b[0m');

    })
    .catch((err => {
        console.error(err)
    }))
