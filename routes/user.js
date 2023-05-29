const express = require('express');
const router = express.Router();
const User = require ('../models/user');
// get user  by id done

// get  users
// create user done
// update user done
// delete user done


// create user done
router.post('/addUser', async(req, res)=>{
    try{
        const user= req.body;
        const newUser = new User(user);
        await newUser.save();
        res.status(201).json({message: 'user created  successfully'});
    }catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to create user'});
    }
    
});

// get user  by id done
router.get('/getUser/:userId', async(req,res) => {

    try{
        const user = await User.findById(req.params.userId);
        if(!user){
            return rs.status(404).json({message:'user not found'});
        }
        res.json(user);  
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Fails to get user'});
    }
}
);
// get  users
router.get('/getUsers', async (req, res) => {
    try{
        const users = await User.find({});
        res.json(users); 
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Failed to get all users'});
    }
}
)
//update user done
router.put ('/updateUser/:userId', async (req,res)=>{
    try{
        const UpdatedUser= req.body;
        const user = new User(UpdatedUser );
        user.findByIdAndUpdate(
            req.params.userId, 
            user,
            (err, result) => {
                if (err) {
                    next(err);
                } else {
                    res.json(result);
                }   
            },
            {new: true},
        );
    } catch(err){
        console.error(err);
        res.status(500).json({message: 'Fails to update user'});
    }
}
);
exports.router = router;