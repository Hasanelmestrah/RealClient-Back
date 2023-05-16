const express = require('express');
const itemsFav = require ('../models/favorite');
const cloudinary = require('cloudinary').v2;
const path = require("path");
const { url } = require('inspector');


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

//get single product
const getfavbyid = async (req, res) => {
  console.log("ENTERED GET ITEM BY ID");
  try {
    const item = await itemsFav.findById(req.params.id);
    console.log("ITEM: ", item);
    res.status(200).json(item);
  } catch (err) {
    res.json({ message: err });
  }
};


//view all products
const getfavitems=async(req,res)=>{
    console.log("ENTERED GET ITEM")
    try{
    const item=await itemsFav.find();
    console.log("ITEM: ", item)
    res.status(200).json(item)
    }
    catch(err){
        res.json({message:err})
    }
}

//add new product
const postfavitems=async(req,res)=>{

    try{
      const result = await cloudinary.uploader.upload(req.file.path);
  

    if(!req.body){
        return res.status(400).json({message:"Error"})
    }
    else{

      
        const items=await itemsFav.create({
        name_fav:req.body.name_fav,
       
        price_fav:req.body.price_fav,
        image_fav: {
          public_id: result.public_id,
          url: result.secure_url,
        },
            });
          
       return res.status(200).json({message: "favv product created successfully"})
    }}
    catch(err){
        console.log("error ",err)
    }
}

//delete a product
const deletefavitems = async (req, res) => {
    try {
      const item = await itemsFav.findByIdAndDelete(req.params.id);
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
const updatefavitems=async(req,res)=>{
  try{
      const item = await itemsFav.findById(req.params.id);
      if (!item) { 
        return res.status(404).json({ error: true, message: 'Item not found' });
      }

      if (req.body.name_fav) {
          item.name_fav = req.body.name_fav;
      }
      if (req.body.price_fav) {
          item.price_fav = req.body.price_fav;
      }
        
      const updatedItem = await item.save();
      return res.status(200).json({ message: 'Favorite item updated successfully' });
  }
  catch(err){
      console.log("error ",err);
      return res.status(500).json({ error: true, message: 'Server error' });
  }
}



module.exports={
    getfavbyid,
    getfavitems,
    postfavitems,
    deletefavitems,
    updatefavitems,
   }