const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
} = require("../controllers/cartControllers");

const fetchUser = require("../middleware/fetchuser");

// routes
router.post("/addcart", fetchUser, addToCart);
router.get("/getcart", fetchUser, getCart);
router.put("/updatecart", fetchUser, updateCart);
router.delete("/removecart", fetchUser, removeFromCart);

module.exports = router;
