const express = require("express");
const asyncHandler = require('express-async-handler')
const Contactus = require("../models/contact");

const getcontactus = async (req, res) => {
  try {
    const getcontact = await Contactus.find();
    res.status(200).json(getcontact);
  } catch (err) {
    res.json({ message: err });
  }
};

const postcontactus = async (req, res) => {
  if (!req.body.fullName || !req.body.Message || !req.body.mail) {
    res.status(400).json({ message: "Error" });
  } else {
    const contactpost = await Contactus.create({
      fullName: req.body.fullName,
      email: req.body.mail,
      Message: req.body.Message,
    });
    return res.status(200).json(contactpost);
  }
};

const contUs = asyncHandler(async(req, res) => {
  const result = await Contactus.findByIdAndRemove(req.params.id);

  if(!result) {
    res.status(400)
    throw new Error('mesh mawjoud aslan la nemhi');
  }

  res.status(200).json({id: req.params.id})
})

module.exports = {
  getcontactus,
  postcontactus,
  contUs,
};