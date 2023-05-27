const mongoose = require('./connection/index');

// user schemas:

const UserSchemas = new mongoose.Schema({
    id: Number ,
    name: String 
});

//create user model:
const User = mongoose.model('User',UserSchema);
module.exports=User;