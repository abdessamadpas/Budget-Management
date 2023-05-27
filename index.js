const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const middlewares = require('../middlewares/errors');
require('dotenv').config()


const app = express();
app.use(express.json());
app.use(express.static('public'))
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));




//! routes




app.get('/hello' , (req , res) => {
    res.json({
        message : " ❤️‍🔥🐉 hello To my backend 🐉❤️‍🔥" ,
    });
});

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

dbUrl = process.env.MONGO_URI
mongoose.connect(dbUrl)
    .then((result) => {
        app.listen(process.env.PORT || 5000);
        console.log('\x1b[33m app connected to mongoDB! \x1b[0m');

    })
    .catch((err => {
        console.error(err)
    }))


    

//api key : 81df64ae8891d649c66e065f5daaf83e