const Cart = require("../models/cartModels");
const Food = require("../models/foodModels");

// ADD TO CART
const addToCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;
    const userId = req.user.id;

    const food = await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            food: foodId,
            quantity,
            price: food.price,
          },
        ],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.food.toString() === foodId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({
          food: foodId,
          quantity,
          price: food.price,
        });
      }
    }

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    res.json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET CART
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate(
      "items.food"
    );

    res.json({
      success: true,
      cart,
    });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE CART
const updateCart = async (req, res) => {
  try {
    const { foodId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) => item.food.toString() === foodId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    item.quantity = quantity;

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    res.json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// REMOVE ITEM
const removeFromCart = async (req, res) => {
  try {
    const { foodId } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.food.toString() !== foodId
    );

    cart.totalAmount = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    res.json({
      success: true,
      message: "Item removed",
      cart,
    });
  } catch {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart,
};
