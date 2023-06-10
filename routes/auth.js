const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { re } = require('semver');

const router = express.Router();

const signup = router.post('/signup', async (req, res) => {
    const user = new User(req.body);
    console.log(user);
    if (!user.name || !user.password || !user.email) {
        res.status(400).json({ error: "Please enter all fields" });
        return;
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        User.create({ ...req.body, password: hashedPassword })
            .then((user) => {
                jwt.sign({ user }, 'secretkey', { expiresIn: '127d' }, (err, token) => {
                    if (err) {
                        res.sendStatus(403);
                    } else {
                        res.status(200).json({
                            user,
                            token
                        });
                    }
                });
            })
            .catch((err) => res.json({ error: err.message }));
    } catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

//update user:
const UpdateUser = router.put('/:Id', verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {
                if (!req.params.Id) {
                    res.json({
                        message: "Please enter all fields"
                    });
                }
                const UpdatedUser = req.body;
                const UpdateUser = await User.findByIdAndUpdate(
                    req.params.Id,
                    UpdatedUser,
                    { new: true }
                );
                if (!UpdateUser) {
                    return res.status(404).json({ message: 'User not found' });
                }
                res.json(UpdateUser);
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to update User"
        });
    }
});

 
const signIn = router.post('/signin', async (req, res, next) => {
    if (req.body.email === "" || req.body.password === "") {
        res.json({
            message: "Please enter all fields"
        });
    }
    const user = await User.findOne({ email: req.body.email });
    console.log("user :", user);
    if (user) {
         const isMatch = await bcrypt.compare(req.body.password, user.password);
            if(isMatch) {
                jwt.sign({ user }, 'secretkey', { expiresIn: '1999d' }, (err, token) => {
                    if (err) {
                        res.sendStatus(403);
                        console.log(err);
                    } else {
                        res.json({
                            user,
                            token
                        });
                    }
                });
            } else {
                next({
                    message : "Password Invalid Bro 👀👀👀"
                })
            }
    } else {
        next({
            message: "Username Invalid try again 🐱‍👓 🐱‍🏍"
        })
    }
});

// get all users
const getAllUsers = router.get('/', verifyToken, (req, res, next) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "authrntication failed try to login "
            })
        } else {
            await User.find({})
                .then((data) => {
                    res.json({
                        data: data,
                    })
                    res.status(200);

                })
        }
    })
})
//get user by id
const getUserById = router.get('/:Userid', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
        if (!req.params.Userid) {
            res.json({
                message: "Please enter all fields"
            });
        }
        const user = await User.findById(req.params.Userid);
        if(!user){
            return res.status(404).json({message:'user not found'});
        }
        res.json(user);
    
}})});

//delete user:
const DeleteUser = router.delete('/:userId', verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {
                if (!req.params.userId) {
                    res.json({
                        message: "Please enter all fields"
                    });
                }
                await User.findByIdAndRemove(req.params.userId);
                res.status(200).json({
                    message: "🪓 User Deleted 🧨"
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete user"
        });
    }
});



// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];

        // Set the token

        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }

}
module.exports = {
    signup,
    signIn,
    getAllUsers,
    getUserById,
    UpdateUser,
    DeleteUser
}