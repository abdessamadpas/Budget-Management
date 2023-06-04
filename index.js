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
const reimbursement = require ('./routes/reimbursement');

const {calculateReimbursementsInExpense} = require('./services/owedAmountInExpense.js');
const {calculateReimbursementsInProduct} = require('./services/owedAmountInProduct.js');

const middlewares = require('./middlewares/errors');


// * middleware
const app = express();
app.use(express.json());
app.use(express.static('public'))
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));

// main route

app.use('/service',calculateReimbursementsInProduct  )
app.use('/service',calculateReimbursementsInExpense  )


// * routes auth
app.use('/auth', auth.singup); // todo done
app.use('/auth', auth.signIn); // todo done
app.use('/auth', auth.UpdateUser); // todo done
 app.use('/auth', auth.DeleteUser);// todo done
 app.use('/auth', auth.getAllUsers);// todo done
 app.use('/auth', auth.getUserById);// todo done


// * product routes
app.use('/product', product.createProduct); // todo done
app.use('/product', product.getAllProduct); // todo done
app.use('/product', product.getOneProduct); // todo done
app.use('/product', product.updateProduct); // todo done
app.use('/product', product.deleteProduct); // todo done
app.use('/product', product.getArchProduct); // todo done


// * group routes
app.use('/group', group.createGroup); // todo done
app.use('/group', group.getGroupById); // todo done
app.use('/group', group.deleteGroup); // todo done
app.use('/group', group.updateGroup); // todo done
app.use('/group', group.getAllGroups); // todo done
app.use('/group', group.addMemberToGroup); // todo done
app.use('/group', group.deleteMemberGroup); // todo done
app.use('/group', group.addExpenseToGroup); // todo done


// * reimbursement routes:
app.use('/reimbursement', reimbursement.createreimbursement); // todo done
app.use('/reimbursement', reimbursement.getAllreimbursement); // todo done
app.use('/reimbursement', reimbursement.getOnereimbursement); // todo done
app.use('/reimbursement', reimbursement.updatereimbursement); // todo done 
app.use('/reimbursement', reimbursement.deletereimbursement); // todo done



// * expenses routes
app.use('/expense', expense.createExpense);// todo done
app.use('/expense', expense.getAllExpense);// todo done
app.use('/expense', expense.getOneExpense);// todo done
app.use('/expense', expense.updateExpense);// todo done
app.use('/expense', expense.deleteExpense);// todo done
app.use('/expense', expense.addProductToExpense); // todo done 



// * expensesType routes
app.use('/expensetype', expensesType.createExpense);// todo done
app.use('/expensetype', expensesType.getAllExpenseType);// todo done
app.use('/expensetype', expensesType.getoneExpenseType);// todo done


app.get('/hello' , (req , res) => {
    res.json({
        message : " ❤️‍🔥🐉 Hello To my backend 🐉❤️‍🔥" ,
    });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


//* connection to mongoDB
const dbUrl = process.env.MONGO_URI
const port = process.env.PORT || 5000
mongoose.connect(dbUrl)
    .then(() => {
        app.listen(port);
        console.log('\x1b[33m app connected to mongoDB! \x1b[0m');
        console.log(`app listening on port ! ${port}`);
    })
    .catch((err => {
        console.error(err)
    }))
