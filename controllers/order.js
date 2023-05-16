const asyncHandler = require("express-async-handler");
const Carts = require("../models/cart");
const Orders = require("../models/order");
const nodemailer = require("nodemailer");
const Address = require("../models/address.js");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "storedayaa@gmail.com", pass: "tdfxykfcvjpfbnyr" },
});

const checkOut = asyncHandler(async (req, res) => {
  let userId = req.params.id;
  let order = await Carts.findOne({ user_id: userId }).populate(
    "items.item_id",
    "name weight "
  );
 

  let address = await Address.findOne({ userID: userId });
  let itemz = order.items;

  if (order.items.length > 0) {
    let html_element = "";
    itemz.forEach((element) => {
      html_element =
        html_element +
        "Item  :" +
        "<b>" +
        element.item_id.name +
        "</b>" +
        " , " +
        "quantity  :" +
        "<b>" +
        element.qty +
        "</b>" +
        " , " +
        "Unit Price  :" +
        "<b>" +
        element.unit +
        "</b>" +
        "<br>" +
        "<br>";
    });

    let details = {
      from: "storedayaa@gmail.com",
      to: "Dayaastore.lb@gmail.com",
      subject: "Incoming order",
      text: "Orders",
      html: `<div>Name:  <b>${address.name}</b></div>
    <br/>
    <div>Phone:  <b>${address.phone}</b></div>
    <br/>
    <div>Email:  <b>${address.email}</b></div>
    <br/>
    <div>City:  <b>${address.city}</b></div>
    <br/>
    <div>Street:  <b>${address.street}</b></div>
    <br/>
    <div>Building:  <b>${address.building}</b></div>
    <br/>
    <div>Details: <b>${address.details}</b></div>
    <br/>
    <div>${html_element}</div>
    <div>Order Total:  <b>${order.total}$</b></div>`,
    };
    mailTransporter.sendMail(details, (err) => {
      if (err) {
        console.log("there was an error", err);
      } else {
        console.log("mail sent successfully!");
      }
    });
    let checkout = await Orders.create({
      user_id: order.user_id,
      items: order.items,
      total: order.total,
      status: "complete",
    });

    if (checkout) {
      order.items = [];
      order.total = 0;
      order.save();
      res.status(201).json("checkout successfull");
    }
  } else res.status(404).send("There are no items in the cart to checkout!");
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Orders.find().populate("user_id").populate("items.item_id",'name weight image');
  res.status(201).json(orders);
});

const cancelOrder = asyncHandler(async (req, res) => {
  let userId = req.params.id;
  let order = await orders.findOne({ userId });
  if (order) {
    order.update({
      status: "canceled",
    });
    res.status(201).json("order canceled");
  } else {
    res.status(400).json("something went wrong");
  }
});

const finishOrder = asyncHandler(async (req, res) => {
  let userId = req.params.id;
  let order = await orders
    .findOne({ userId })
    .populate("items.item_id", "name weight ");
  console.log(order);
  if (order) {
    order.update({
      status: "complete",
    });
    res.status(201).json("order completed");
  } else {
    res.status(400).json("something went wrong");
  }
});

module.exports = { finishOrder, cancelOrder, checkOut, getOrders };
