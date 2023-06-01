
const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// create product
const createProduct = router.post('/add', async(req, res)=>{
    try{
        const product= req.body;
        
        await Product.create(product).then((result) => {
                
                res.status(200)
                res.json({
                    result,
                })
            }).catch((err) => res.json({
                error: err.message
            }))
    }catch (err) {
        console.error(err);
        res.status(500).json({message: 'Failed to create product'});
    }
});
// get product by id
const getOneProduct =router.get('/:productId', async(req,res) => {
            
        try{
            const product = await Product.findById(req.params.productId);
            if(!product){
                return rs.status(404).json({message:'product not found'});
            }
            res.json(product);  
        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Fails to get product'});
        }
    }
);

// get all products
const getAllProduct =router.get('/',verifyToken, async (req, res,next) => {
    
    jwt.verify(req.token, 'secretkey', async (err) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })

        } else {
            await Product.find({})
                .then((data) => {
                    res.status(200);
                    res.json({
                        products: data,
                    })

                })
        }

    })

    
}
);

//update product
    const updateProduct = router.put('/update/:id', verifyToken, async (req, res, next) => {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed try to login "
                })
    
            } else {
                Product.updateOne({ _id: req.params.id }, req.body, { new: true }, (err, newProduct) => {
                    if (err) next(err)
                    res.status(200)
                    res.json({
                        message: "✔ update succeeded ✔"
                    })
                })
            }
    
        })
    })


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

// delete product
const deleteProduct = router.delete('/delete/:id', verifyToken, async (req, res, next) => {
jwt.verify(req.token, 'secretkey', async (err, authData) => {
    if (err) {
        res.status(403).json({
            message: "Authentication failed try to login "
        })

    } else {
        Product.deleteOne({ _id: req.params.id }, (err, newProduct) => {
            if (err) next(err)
            res.status(200)
            res.json({
                message: "✔ delete succeeded ✔"
            })
        })
    }

}
)
})

module.exports = {
    createProduct,
    getOneProduct,
    getAllProduct,
    updateProduct,
    deleteProduct
}