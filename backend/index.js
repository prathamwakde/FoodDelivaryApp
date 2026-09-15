require("dotenv").config();

const connectToMongo  = require('./db');
const express = require('express')
connectToMongo();
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())

app.use("/api/auth", require("./router/UserRouter"));
app.use("/api/food", require("./router/FoodRouter"));
app.use("/api/cart", require("./router/CartRouter"));
app.use("/api/order", require("./router/OrderRouter"));
app.use("/api", require("./router/PaymentRouter"));

const port = 8000 

app.listen(port, () => {
  console.log(`Food-Delivary-App backend listening at http://localhost:${port}`)
})