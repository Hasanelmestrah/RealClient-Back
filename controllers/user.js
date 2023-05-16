const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/user')
const Carts = require('../models/cart')
const address = require("../models/address")

//generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id }, process.env.JWT_SECRET, 
    { expiresIn:  '1d' }
    )
}

// this function get the users
// the route is GET/api/users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
  res.status(200).json(users)
})

// this function gets a user data
// the route is GET/api/users/user
const getUser = asyncHandler(async(req, res) => {
  const { _id, name, email, userType } = await User.findById(req.user.id)
  res.status(200).json({
    id: _id,
    name: name,
    email: email,
    userType: userType
  })
})

// this function Registers a user
// the route is POST/api/users
const registerUser = asyncHandler(async(req, res) => {
  const { name, email, password, userType} = req.body

  if (!name || !email || !password){
    res.status(400)
    throw new Error('Please fill all fields')
  }

  //check if user exists
  const userExists = await User.findOne({email})

  if (userExists){
    res.status(400)
    throw new Error('User already exists')
  }

  //hashing password
  const hash = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, hash)

  //create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    userType
  })

  if(user){
    const items=[]
    Carts.create({
      user_id:user.id,
      items,
      total:0,
      
    })
    address.create({
      userID: user.id,
      name: " ",
      phone: " ",
      street: " ",
      city:" ",
      email: " ",
      building: " ",
      details:" ",
      

    })


    

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email:user.email,
      token: generateToken(user._id),
      userType: user.userType,
      
    })
  } else {
    res.status(400)
    throw new Error('invalid user data')
  }
})

// this function Authenticate a user
// the route is POST/api/users/login
const loginUser = asyncHandler(async(req, res) => {
  const {email, password, userType} = req.body
  const user = await User.findOne({email})
  if(user && (await bcrypt.compare(password, user.password))){
    res.json({
      _id: user.id,
      name: user.name,
      email:user.email,
      token: generateToken(user._id),
      userType: user.userType
    })
  }
  else if(!user){
    res.status(400)
    throw new Error('Not an existing user')
  }
  else{
     res.status(400)
     throw new Error('invalid email or password')
  }
})

// const deleteAllUsers = asyncHandler(async (req, res) => {
//   const result = await User.deleteMany({});
//   res.status(200).json({ message: `${result.deletedCount} users have been deleted.` });
// });

module.exports = {
  registerUser,
  loginUser,
  // deleteAllUsers,
  getUsers,
  getUser
}