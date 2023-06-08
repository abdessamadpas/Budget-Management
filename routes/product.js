
const express = require('express');
const Product = require('../models/product');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// create product
const createProduct = router.post('/add', async(req, res)=>{
    try{
        const product= req.body;
        if (!product.name || !product.price ) {
            res.status(400).json({ message: 'Please enter all fields' });
        }
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
// get arch of  expenses :
const getArchProduct = router.get('/arch/products', verifyToken,async(req,res)=>{
    jwt.verify(req.token, 'secretkey', async (err) => {
        if (err) {
            res.status(403)
            res.json({
                message: "Authentication failed try to login "
            })
        } else {
            await Product.find().sort().populate([{
                path: 'expense',
                populate: {
                    path: 'Group',
                }

            }])
                .then((data) => {
                    res.status(200);
                    res.json({
                        products: data,
                    })
                })
        }
    })
});
    


// get all products
const getAllProduct =router.get('/',verifyToken, async (req, res) => {
    
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
    const updateProduct = router.put('/:productId', verifyToken, async (req, res) => {
        try {
            jwt.verify(req.token, 'secretkey', async (err, authData) => {
                if (err) {
                    res.status(403).json({
                        message: "Authentication failed, try to login"
                    });
                } else {
                    const updatedproduct = req.body;
                    const updateproduct = await Product.findByIdAndUpdate( 
                        req.params.productId,
                        updatedproduct,
                        { new: true }
                    );
                    if (!updateproduct) {
                        return res.status(404).json({ message: 'Product not found' });
                    }
                    res.json(updateproduct);
                }
            });
        } catch (err) {
            res.status(500).json({
                message: "Failed to update product"
            });
        }
    });

//verify token
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
const deleteProduct = router.delete('/:Id', verifyToken, async (req, res) => {
    try {
        jwt.verify(req.token, 'secretkey', async (err, authData) => {
            if (err) {
                res.status(403).json({
                    message: "Authentication failed, try to login"
                });
            } else {
                await Product.findByIdAndRemove(req.params.Id);
                res.status(200).json({
                    message: "🪓 Product Deleted 🧨"
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete product"
        });
    }
});

module.exports = {
    createProduct,
    getOneProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
    getArchProduct
    
}