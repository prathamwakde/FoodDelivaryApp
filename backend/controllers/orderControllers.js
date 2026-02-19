const Order = require("../models/orderModels");


// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    const newOrder = new Order({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      orderStatus: "Pending",
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};


// GET USER ORDERS
const getMyOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.food");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};


// ADMIN GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.food");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching all orders",
    });
  }
};


// UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: req.body.orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order",
    });
  }
};


// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting order",
    });
  }
};

module.exports = {
  createOrder,
  getMyOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
