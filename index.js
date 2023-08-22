const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config()
const app = express();

const http = require('http');
const socketIO = require('socket.io');


const server = http.createServer(app);
const io = socketIO(server);
app.set('socketio', io);




const auth = require('./routes/auth.js');
const expensesType = require('./routes/expensetype.js');
const product = require('./routes/product.js');
const group = require('./routes/group.js');
const expense = require('./routes/expenses.js');
const reimbursement = require ('./routes/reimbursement.js');

const {calculateReimbursementsInExpense} = require('./services/owedAmountInExpense.js');
const {calculateReimbursementsInProduct} = require('./services/owedAmountInProduct.js');
const {getBalanceUser} = require('./services/getBlanceUser.js');
const {groupByUser} = require('./services/groupsByUser.js');
const {createExpenseWithProducts} = require('./services/createExpese.js');
const {expenseSocket} = require('./services/socketExpense.js');
const middlewares = require('./middlewares/errors.js');




// * middleware

app.use(express.json());
app.use(express.static('public'))
app.use(helmet());
app.use(cors());

app.get('env') === 'development' && app.use(morgan('tiny'));

// * connect to socket expense
app.use('/sockets', expenseSocket);

// main route

app.use('/service',calculateReimbursementsInProduct  )
app.use('/service',calculateReimbursementsInExpense  )
app.use('/service',getBalanceUser)
app.use('/service', groupByUser)
app.use('/service',createExpenseWithProducts);

// * routes auth
app.use('/auth', auth.signup); // todo done
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
app.use('/expense', expense.totalExpansesInGroup);// todo done
app.use('/expense', expense.getExpansesByGroup);// todo done



// * expensesType routes
app.use('/expensetype', expensesType.createExpense);// todo done
app.use('/expensetype', expensesType.getAllExpenseType);// todo done
app.use('/expensetype', expensesType.getoneExpenseType);// todo done
app.use('/expensetype', expensesType.deleteExpenseType);// todo done


app.get('/hello' , (req , res) => {
    res.json({
        message : " ❤️‍🔥🐉 Hello To my backend 🐉❤️‍🔥" ,
    });
});



app.use(middlewares.notFound);
app.use(middlewares.errorHandler);


//* connection to mongoDB
const dbUrl = process.env.MONGO_URI
const port = process.env.PORT || 3000
mongoose.connect(dbUrl)
    .then(() => {
        server.listen(port);
        console.log('\x1b[33m app connected to mongoDB! \x1b[0m');
        console.log(`app listening on port ! ${port}`);
    })
    .catch((err => {
        console.error(err)
    }))
