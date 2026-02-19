const express = require("express");
const router = express.Router();

const fetchuser = require("../middleware/fetchuser");

const {
  createOrder,
  getMyOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderControllers");

router.post("/create", fetchuser, createOrder);
router.get("/myorders", fetchuser, getMyOrder);
router.get("/all", fetchuser, getAllOrders);
router.put("/update/:id", fetchuser, updateOrderStatus);
router.delete("/delete/:id", fetchuser, deleteOrder);

module.exports = router;
