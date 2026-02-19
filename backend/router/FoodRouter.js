const express = require("express");
const router = express.Router();

const fetchuser = require("../middleware/fetchuser");
const Food = require("../models/foodModels");

const {
  addFood,
  getAllFood,
  updateFood,
  deleteFood,
} = require("../controllers/foodControllers");

router.post("/addfood", fetchuser, addFood);
router.get("/getfood", getAllFood);
router.put("/updatefood/:id", fetchuser, updateFood);
router.delete("/deletefood/:id", fetchuser, deleteFood);

router.get("/search", async (req, res) => {
  try {
    const searchTerm = req.query.q || "";

    const foods = await Food.find({
      title: { $regex: searchTerm, $options: "i" },
    });

    res.json({
      success: true,
      foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching foods",
    });
  }
});

module.exports = router;
