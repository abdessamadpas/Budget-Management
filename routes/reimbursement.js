const express = require('express');
const router = express.Router();
const Reimbursement = require ('../models/reimbursement');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//create new reimbursement:
const createreimbursement=router.post('/add', verifyToken, async (req,res)=>{
    try{
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403)
                res.json({
                    message: "Authentication failed try to login "
                })
            }else{
                await Reimbursement.create(req.body).then((result) => {
                    res.status(200)
                    res.json({
                        result,
                    })
                }
                )
            }
         });
    } catch (err) {
         res.json({
            error: err.message
        });
    }      
});

const ERROR_AUTH_FAILED = "Authentication failed, please try to login";
const SECRET_KEY = "your_secret_key";

// const createreimbursement = router.post('/add', verifyToken, async (req, res) => {
//   try {
//     jwt.verify(req.token, SECRET_KEY, async (err, authData) => {
//       if (err) {
//         res.status(403).json({
//           message: ERROR_AUTH_FAILED
//         });
//       } else {
//         const result = await Reimbursement.create(req.body);
//         res.status(200).json({
//           result
//         });
//       }
//     });
//   } catch (err) {
//     res.json({
//       error: err.message
//     });
//   }
// });

//get reimbursement by id:
router.get('/reimbursement/:reimbursementID', async(req,res)=>{
    try{
        const reimbursement = await reimbursement.findById(req.params.reimbursementID);
        if(!reimbursement){
            return rs.status(404).json({message:'Reimbursement not found'});
        }
        res.json(reimbursement);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Fails to get reimbursement'});
    }
});

//get all reimbursement:
const getAllreimbursement = router.get('/',verifyToken, async (req,res,next)=>{
    jwt.verify(req.token, 'secretkey', async (err,authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })

        } else {
            await Reimbursement.find({})
                .then((data) => {
                    res.status(200);
                    res.json({
                        reimbursement: data,
                    })
                }).catch((err) => res.json({
                    error: err.message
                }))
        }
    })
});

//update reimbursement:
const updatereimbursement=router.put('/:reimbursementId', verifyToken, async (req,res,next)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403).json({
                message: "Authentication failed try to login "
            })

        } else {
            const Updatereimbursement= req.body;
            const reimbursement = new Reimbursement(Updatereimbursement);
            const updatereimbursement = await reimbursement.findByIdAndUpdate(
                req.params.reimbursementId, 
                reimbursement,
                {new: true}
            );
            if(!updatereimbursement){
            return rs.status(404).json({message:'Reimbursement not found'});
            }
            res.json(updatereimbursement);
   
}})});
    
 



//delete Reimbursement:
const deletereimbursement= router.delete('/:reimbursementId',verifyToken, async (req,res,next) => {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403).json({
                message: "Authentication failed try to login "
            })
    
        } else {
            Reimbursement.deleteOne({ _id: req.params.id }, (err, newProduct) => {
                if (err) next(err)
                res.status(200)
                res.json({
                    message: "✔ delete succeeded ✔"
                })
            })
        }
    
    }
    )
});

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
        res.status(403)
        next({
            message: "Forbidden you have to login first bro😪🥱"
        })
    }    
}  


module.exports ={
    createreimbursement,
    getAllreimbursement,
    //getOnereimbursement,
    updatereimbursement,
    deletereimbursement
};