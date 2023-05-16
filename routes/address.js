const express = require("express");
const router = express.Router();
const {
  createAddress,
  getAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
} = require("../controllers/address.js");
const { protect } = require("../middleware/authMiddleware");

router.route("/").get(getAddresses)
router.route("/:id").get(getAddressById).patch(updateAddress).delete(deleteAddress)
router.post("/:id", createAddress)

module.exports = router;
