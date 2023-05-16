const express = require('express');
const router = express.Router();
const upload= require('../middleware/upload')
const { protect } = require("../middleware/authMiddleware");

const { getfavitems,getfavbyid,  postfavitems,deletefavitems,updatefavitems }=require("../controllers/favorites");

router.get("/getfav", getfavitems)
router.get("/getfav/:id", getfavbyid );
router.post("/addfav", protect,upload.single('image_fav'), postfavitems)
router.delete("/delfav/:id",protect, deletefavitems )
router.put("/updfav/:id",protect, updatefavitems )



module.exports=router;

