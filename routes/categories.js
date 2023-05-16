const express = require('express');
const router = express.Router();
const upload= require('../middleware/upload')


const { getcategories, getcategorybyid,
    postcategory,
    deletecategory,
    updatecategory}=require("../controllers/categories");

router.get("/getcategory",getcategories)
router.get("/getcategory/:id",getcategorybyid )

router.post("/addcategory",upload.single('image_category'),  postcategory)
router.delete("/delcategory/:id",deletecategory)
router.put("/updcategory/:id", updatecategory)


module.exports=router;

