const express = require("express");
const router = express.Router();

const fetchuser = require("../middleware/fetchuser.js")
const { signupUser, loginUser, getUser } = require("../controllers/userControllers");

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/getuser", fetchuser, getUser);

module.exports = router;
