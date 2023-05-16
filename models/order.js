const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
   
      items: [
        {
          item_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "items",
          },
          qty: { type: Number, required: true ,default: 1,},
          unit: { type: Number, required: true },
        },
      ],
    
    total: { type: Number, default: 0.0 },
    status:{type:String,enum:['canceled','pending','complete'],default:'pending'},
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model("orders", orderSchema);
