const express = require('express');
const categoryModels = require ("../models/categories")
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

//view all categories
const getcategories=async(req,res)=>{
    console.log("ENTERED GET CATEGORY")
    try{
    const category=await categoryModels.find();
    console.log("CATEGORY: ", category)
    res.status(200).json(category)
    }
    catch(err){
        res.json({message:err})
    }
}

//get single product
const getcategorybyid = async (req, res) => {
  console.log("ENTERED GET CATEGORY BY ID");
  try {
    const category = await categoryModels.findById(req.params.id);
    console.log("CATEGORY: ", category);
    res.status(200).json(category);
  } catch (err) {
    res.json({ message: err });
  }
};

//add new category
const postcategory = async (req, res) => {
  
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const product = new categoryModels ({
      name_category:req.body.name_category,
      image_category: {
        public_id: result.public_id,
        url: result.secure_url,
      },
     
    });
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};
 



  //delete a category
const deletecategory = async (req, res) => {
    try {
      const category = await categoryModels.findByIdAndDelete(req.params.id);
      if (!category) { 
        return res.status(404).json({ error: true, message: 'Category not found' });
      }
      return res.status(200).json({ id: category._id }); 
    } catch (error) { 
      console.error(error);
      return res.status(500).json({ error: true, message: 'Server error' });
    }
  };

    //update category
const updatecategory = async (req, res) => {
    try {
      const category= await categoryModels.findById(req.params.id); 
      if (!category) { 
        return res.status(404).json({ error: true, 
                                      message: 'Category not found' });
      }
  
      category.name_category = req.body.name_category;
     
  
      const updatedCategory= await category.save(); 
      return res.status(200).json(updatedCategory);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, 
                                    message: 'Server error' });
    }
  };


module.exports={
    getcategories,
    getcategorybyid,
    postcategory,
    deletecategory,
    updatecategory,
   }