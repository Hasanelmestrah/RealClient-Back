const express = require('express');
const router = express.Router();
const{removeFromCart,getCart,addToCart, reduceFromCart,}=require('../controllers/cart');
const { protect } = require('../middleware/authMiddleware');


router.get("/:id",protect, getCart)
router.post("/:id",protect, addToCart)
router.delete("/:id/:key",protect,removeFromCart)
router.patch("/:id",protect, reduceFromCart)











module.exports=router;