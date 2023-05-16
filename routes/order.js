const express = require("express");
const router = express.Router();
const { checkOut, cancelOrder, finishOrder,getOrders } = require("../controllers/order");
const { protect } = require("../middleware/authMiddleware");

router.post("/:id",protect, checkOut);
router.get("/",protect, getOrders)
router.patch("/complete/:id", finishOrder);
router.patch("/cancel/:id", cancelOrder);

module.exports = router;
