const express = require('express');
const router = express.Router();
const Reimbursement = require ('../models/reimbursement');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//create new reimbursement:
const createreimbursement = router.post('/add',verifyToken  ,async(req, res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{
            const reimb = req.body;
            if (!reimb.provider || !reimb.amount) {
               
                return res.status(400).json({ message: 'Please enter all fields' });
                };
            await Reimbursement.create(reimb).then((result) => {
                res.status(200)
                res.json({
                    result,
                })
            }
            ).catch((err) => res.json({
                error: err.message
            }))

        }
    })
});



//get reimbursement by id:
const getOnereimbursement = router.get('/:reimbursementid', verifyToken,async(req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        }else{

        const reimbursement = await Reimbursement.findById(req.params.reimbursementid);
        if(!reimbursement){
            return rs.status(404).json({message:'Reimbursement not found'});
        }
        res.json(reimbursement);
    
}})});

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
const updatereimbursement = router.put('/:reimbursementId', verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {
                const updatedreimbursement = req.body;
                const updatereimbursement = await Reimbursement.findByIdAndUpdate( 
                    req.params.reimbursementId,
                    updatedreimbursement,
                    { new: true }
                );
                if (!updatereimbursement) {
                    return res.status(404).json({ message: 'Reimbursement not found' });
                }
                res.json(updatereimbursement);
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to update reimbursement"
        });
    }
});



//delete Reimbursement:
const deletereimbursement = router.delete('/:Id', verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {
                await Reimbursement.findByIdAndRemove(req.params.Id);
                res.status(200).json({
                    message: "🪓 User Reimbursement 🧨"
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete Reimbursement"
        });
    }
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
    getOnereimbursement,
    updatereimbursement,
    deletereimbursement,
    updatereimbursement
};