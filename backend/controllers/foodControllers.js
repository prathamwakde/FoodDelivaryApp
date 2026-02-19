const Food = require("../models/foodModels");

const addFood = async (req, res) => {
  try {
    const { title, description, price, image, category } = req.body;

    const newFood = new Food({
      title,
      description,
      price,
      image,
      category,
    });

    await newFood.save();

    res.status(201).json({
      success: true,
      message: "Food item added successfully",
      food: newFood,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding food item",
      error: error.message,
    });
  }
};


const getAllFood = async (req, res) => {
  try {
    const foods = await Food.find();

    res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching foods",
      error: error.message,
    });
  }
};


const updateFood = async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating food",
      error: error.message,
    });
  }
};


const deleteFood = async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);

    if (!deletedFood) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting food",
      error: error.message,
    });
  }
};

module.exports = {
  addFood,
  getAllFood,
  updateFood,
  deleteFood,
};
