const asyncHandler = require("express-async-handler");
const Carts = require("../models/cart");
const Product = require("../models/items");
var mongoose = require("mongoose");
const items = require("../models/items");
var Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  
  const productId = req.body.productId;
 
  let cart = await Carts.findOne({user_id: userId });
 
  let product = await Product.findOne({ _id: productId });
  let item = { item_id: ObjectId, qty: 1, unit: 0 };
  item.item_id = productId;
  let itemIndex = cart.items.findIndex(
    (p) => p.item_id.toString() === productId.toString()
  );
 
  if(cart && product){
  if (product.discount_per > 0) {

    item.unit = product.price_after_discount;
  } else {
    item.unit = product.price;
  }
  if (itemIndex > -1) {
    
    let productItem = cart.items[itemIndex];
    productItem.qty += 1;
    cart.items[itemIndex] = productItem;
  } else {
    cart.items.push(item);
  }
  cart.total += item.unit;
  let carta = await cart.save();
  return res.status(201).send(carta);
}else{
  res.status(400).json("something went wrong")
}
});

const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const productId = req.params.key
console.log(productId)
  let cart = await Carts.findOne({ user_id:userId });

  let itemIndex = cart.items.findIndex(
    (p) => p.item_id.toString() === productId.toString()
  );
  console.log(itemIndex)
  if (itemIndex > -1) {
    let product = cart.items[itemIndex];
    let sum = product.qty * product.unit;
    cart.items.splice(itemIndex, 1);
    cart.total -= sum;
    cart = await cart.save();
    return res.status(201).send(cart);
  } else {
    res.status(400).json("item does not exist")
  }
});

const getCart = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  let cart = await Carts.findOne({ user_id:userId }).populate('items.item_id','name weight image')
  
 
  
  res.status(201).send(cart);
});



const reduceFromCart =asyncHandler(async(req,res)=>{
  const userId = req.params.id;
  const productId = req.body.productId;
  let cart = await Carts.findOne({ user_id:userId });
  let itemIndex = cart.items.findIndex(
    (p) => p.item_id.toString() === productId.toString()
  );
  if(itemIndex> -1){
    let product = cart.items[itemIndex];
    if (product.qty==1){
      cart.items.splice(itemIndex, 1);
      cart.total-=product.unit
    }else if (product.qty>1){
      product.qty-=1
      cart.total-=product.unit

    }
    cart = await cart.save();
    return res.status(201).send(cart);

    
  }else{
    res.status(500).json("something went wrong ")
  }

})
module.exports = { removeFromCart, addToCart, getCart ,reduceFromCart};
