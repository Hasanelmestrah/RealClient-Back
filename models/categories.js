const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");


const categories= new mongoose.Schema({
   name_category:{
            type:String,
            // required:[true, 'Please add a category Name'],
        },

        image_category: {
          public_id:{
             type: String,
             //required: true,
          },
          url:{
             type: String,
             //required: true,
          }
        },
  },
{
timestamps: true,
}
)
module.exports = mongoose.model("categories", categories);