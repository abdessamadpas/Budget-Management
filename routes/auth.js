const express = require('express');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

const singup = router.post('/signup', async (req, res) => {

    const hashedPassword = await bcrypt.hash( req.body.password, 10);
    const user = new User(req.body);
    // const salt = await bcrypt.genSalt(10);
    
    User.create({ ...req.body, password: hashedPassword })
        .then((result) => {
            jwt.sign({ User }, 'secretkey', { expiresIn: '127d' }, (err, token) => {
                if (err) {
                    res.sendStatus(403);
                } else {
                    res.status(200)
                    res.json({
                        result,
                        token
                    })
                }
            });
        }).catch((err) => res.json({
            error: err.message
        }))
})


const UpdateUser = router.put('/Update/:id', verifyToken, async (req, res, next) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403).json({
                message: "Authentication failed try to login "
            })
        } else {
            UserModel.updateOne({ _id: req.params.id }, req.body, { new: true }, (err, newRoomInfo) => {
                if (err) next(err)
                res.status(200)
                res.json({
                    message: "✔ update user  succeeded ✔"
                })
            })
        }
    })
});


// const signIn = router.post('/signin', async (req, res, next) => {
//     try {
//       console.log(req.body);
//       const user = await User.findOne({ email: req.body.email });
//       if (user) {
//         const isMatch = await bcrypt.compare(req.body.password, user.passwordHash);
//         if (isMatch) {
//           jwt.sign({ user }, 'secretkey', { expiresIn: '1h' }, (err, token) => {
//             if (err) {
//               console.error(err);
//               res.sendStatus(500);
//             } else {
//               res.json({
//                 user,
//                 token
//               });
//             }
//           });
//         } else {
//             next({
//                  message : "Password Invalid Bro 👀👀👀"
//              });
//         }
//       } else {
//         next({
//             message: "Username Invalid try again 🐱‍👓 🐱‍🏍"
//         });
//       }
//     } catch (error) {
//       console.error(error);
//       next(error);
//     }
//   });
 
const signIn = router.post('/signin', async (req, res, next) => {
    try {
      console.log(req.body);
      const user = await User.findOne({ email: req.body.email });
  
      if (user) {
        const isMatch = await bcrypt.compare(req.body.password, user.password);
  
        if (isMatch) {
          // Password matches, generate a token
          jwt.sign({ user }, 'secretkey', { expiresIn: '9999999h' }, (err, token) => {
            if (err) {
              console.error(err);
              res.sendStatus(500);
            } else {
              res.json({
                user,
                token
              });
            }
          });
        } else {
          // Password does not match
          throw new Error('Invalid password');
        }
      } else {
        // User not found
        throw new Error('Invalid username');
      }
    } catch (error) {
      console.error(error);
      next(error);
    }
});

// verify token
const getAllUsers = router.get('/Users', verifyToken, (req, res, next) => {


    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {

            res.status(403)
            res.json({
                message: "authrntication failed try to login "
            })

        } else {
            await UserModel.find().sort()
                .then((data) => {
                    res.json({
                        data: data,
                    })
                    res.status(200);

                })

        }

    })
})
//
const getUser = router.get('/Users/:id', verifyToken, (req, res, next) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {

            res.status(403)
            res.json({
                message: "authrntication failed try to login "
            })

        } else {
            const User = await UserModel.findOne({ _id: req.params.id });

                if(User){
                    res.status(200);
                    res.json({
                        User: User,
                    })
                }else{
                    next({
                        message : "User not found bro are you joking 🤷‍♂️"
                    })
                }
        }

    })
})


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
    singup,
    signIn,
    getAllUsers,
    getUser,
    UpdateUser
}