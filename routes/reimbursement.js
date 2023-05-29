const express = require('express');
const router = express.Router();
const Reimbursement = require ('../models/reimbursement');

//create new reimbursement:
router.post('/reimbursement', async (rq,res)=>{
    try{
        const reimbursement = req.body;
        const newReimbursement=new Reimbursement(reimbursement);
        await newReimbursement.save();
    }catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to create group'});
    }
});

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
router.get('/reimbursement',async (req,res)=>{
    try{
        const reimbursements = await Reimbursement.find({});
        res.json(reimbursements); 
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Failed to get all reimbursements'});
    }
});

//update reimbursement:
router.put('/reimbursement/:reimbursementId', async (req,res)=>{
    try{
        const UpdatedReimbursement= req.body;
        const reimbursement = new Group(UpdatedReimbursement);
        const UpdateReimbursement = await reimbursement.findByIdAndUpdate(
            req.params.reimbursementId, 
            reimbursement,
            {new: true}
        );
        if(!UpdateReimbursement){
           return rs.status(404).json({message:'Reimbursement not found'});
        }
        res.json(UpdateReimbursement);
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Fails to update reimbursement'});
    }
});


//delete Reimbursement:
router.delete('/reimbursement/:reimbursementId', async (req,res) => {
    try{
        Group.findByIdAndRemove({ _id: req.params.id }, (err,) => {
            if (err) next(err)
            res.status(200).json({
                message: "🪓 Reimbursement Deleted 🧨"
            });
        });
        res.json({message:'Reimbursement deleted successfully'});
    }catch(err){
        console.error(err);
        res.status(500).json({message: 'Fails to delete reimbursement'});
    }
});



module.exports =router;