const express = require("express");
const app = express();
const dotenv = require("dotenv");

dotenv.config();
const cors = require("cors");
const mongoose = require("mongoose");
const connection = require("./configure/db.js");
const bodyparser = require("body-parser");
const path = require("path");
const { errorHandler } = require("./middleware/errormiddleware");

const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const itemRouter = require("./routes/items");
const contactusRoutes = require("./routes/contact");
const userRoutes = require("./routes/user.js");
const addressRouter = require("./routes/address.js");

const catRouter = require("./routes/categories");
const favRouter = require("./routes/favorite");



connection();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

connection();

app.use("/order", orderRouter);
app.use("/item", itemRouter);
app.use("/cat", catRouter);
app.use("/cart", cartRouter);
app.use('/adress', addressRouter )
app.use("/fav", favRouter);


const port = process.env.PORT || 8000;

app.use("/contactus", contactusRoutes);
app.use("/api", userRoutes); //raoul route for users
app.use(errorHandler); //error handler for default stack response
app.listen(port, () => console.log(`server listening on port ${port}`));
