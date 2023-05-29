const mongoose =  require ('mongoose');

// user schemas:

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
    },
    password:{
        type: String,
        required: true,
    },
    phone:{
        type: String,
    },
}, {timestamps: true});

const User = mongoose.model('User',UserSchema);
module.exports=User;