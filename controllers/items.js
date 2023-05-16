const express = require('express');
const itemsModels = require ('../models/items.js');
const cloudinary = require('cloudinary').v2;
const path = require("path");
const { url } = require('inspector');


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

//get single product
const getitembyid = async (req, res) => {
  console.log("ENTERED GET ITEM BY ID");
  try {
    const item = await itemsModels.findById(req.params.id).populate("category");
    console.log("ITEM: ", item);
    res.status(200).json(item);
  } catch (err) {
    res.json({ message: err });
  }
};


//view all products
const getitems=async(req,res)=>{
    console.log("ENTERED GET ITEM")
    try{
    const item=await itemsModels.find().populate("category");
    console.log("ITEM: ", item)
    res.status(200).json(item)
    }
    catch(err){
        res.json({message:err})
    }
}

//calculate the new price
function calculateDiscountedPrice(price, discountPercentage) {
  const discountAmount = price * (discountPercentage / 100);
  const discountedPrice = price - discountAmount;
  return discountedPrice;
}

//add new product
 const postitems=async(req,res)=>{

    try{
      const result = await cloudinary.uploader.upload(req.file.path);
  

    if(!req.body){
        return res.status(400).json({message:"Error"})
    }
    else{

      const price = req.body.price;
      const discountPercentage = req.body.discount_per || 0; // default to 0 if not provided
      const priceAfterDiscount = calculateDiscountedPrice(price, discountPercentage);
      
        const items=await itemsModels.create({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        weight:req.body.weight,
        discount_per:req.body.discount_per,
        category: req.body.category,
        image: {
          public_id: result.public_id,
          url: result.secure_url,
        },
        discount_per: discountPercentage,
        price_after_discount: priceAfterDiscount,
            });
          
       return res.status(200).json({message: "product created successfully"})
    }}
    catch(err){
        console.log("error ",err)
    }
}

//delete a product
const deleteitems = async (req, res) => {
  try {
    const item = await itemsModels.findByIdAndDelete(req.params.id);
    if (!item) { 
      return res.status(404).json({ error: true, message: 'Item not found' });
    }
    return res.status(200).json({ id: item._id }); 
  } catch (error) { 
    console.error(error);
    return res.status(500).json({ error: true, message: 'Server error' });
  }
};


  //update a product
const updateitems = async (req, res) => {
  try {
    const item = await itemsModels.findById(req.params.id); 
    if (!item) { 
      return res.status(404).json({ error: true, message: 'Item not found' });
    }

    if (req.body.name) {
      item.name = req.body.name;
    }
    if (req.body.description) {
      item.description = req.body.description;
    }
    if (req.body.price !== undefined) {
      const oldPrice = item.price;
      const oldDiscountPercentage = item.discount_per || 0;
      const newPrice = req.body.price;

      item.price = newPrice;

      if (oldDiscountPercentage > 0) {
        const newPriceAfterDiscount = calculateDiscountedPrice(newPrice, oldDiscountPercentage);
        item.price_after_discount = newPriceAfterDiscount;
      }
    }
    if (req.body.weight) {
      item.weight = req.body.weight;
    }
    if (req.body.discount_per !== undefined) {
      const oldPrice = item.price;
      const oldDiscountPercentage = item.discount_per || 0;
      const newDiscountPercentage = req.body.discount_per || 0;
      
      if (newDiscountPercentage !== oldDiscountPercentage) {
        const newPriceAfterDiscount = calculateDiscountedPrice(oldPrice, newDiscountPercentage);
        item.price_after_discount = newPriceAfterDiscount;
      }
      
      item.discount_per = newDiscountPercentage;
    }
    if (req.body.category_id) {
      item.category = req.body.category;
    }
    if (req.body.price) {
      item.price = req.body.price;
    }

    const updatedItem = await item.save(); 
    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: 'Server error' });
  }
};


//retrieve product based on specific category id

const getItemsByCategory = async (req, res) => {
 
  console.log("ENTERED GET ITEM")
  try{
  const category_id = req.params.category_id;
  const item = await itemsModels.find({ category: category_id }).populate("category");
  console.log("ITEM: ", item);
  res.status(200).json(item);
  }
  catch(err){
  res.json({ message: err });
  }
}

//retrieve product based on specific category name
const getItemsByCategoryName = async (req, res) => {
  console.log("ENTERED GET ITEM")
  console.log("ENTERED GET ITEM");
  try {
    const categoryName = req.params.categoryName;
    const items = await itemsModels.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $match: {
          "category.name_category": categoryName,
        },
      },
    ]);
    console.log("ITEMS: ", items);
    res.status(200).json(items);
  } catch (err) {
    res.json({ message: err });
  }

};
/////////////////////discounts
const getdiscount = async (req, res) => {
  console.log("ENTERED GET ITEM")
  try {
    const items = await itemsModels.find({ discount_per: { $ne: 0 } }).populate("category");
    console.log("ITEM: ", items);
    res.status(200).json(items);
  } catch (err) {
    res.json({ message: err });
  }
}


  
module.exports={
  getItemsByCategory,
  getItemsByCategoryName,
  getitembyid,
  getitems,
  postitems,
  deleteitems,
  updateitems,
  getdiscount,
 }