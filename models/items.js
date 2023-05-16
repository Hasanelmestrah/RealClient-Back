const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const{Schema,model}=mongoose;


const items= new mongoose.Schema({
   name:{
            type:String,
            // required:[true, 'Please add a product Name'],
        },
 
   image: {
         public_id:{
            type: String,
            //required: true,
         },
         url:{
            type: String,
            //required: true,
         }
       },

   description:{
           type:String,
           //required:[true, 'Please add a product Description'],
        },
   price:{
           type: Number,
           
        },
   weight:{
           type: Number, 
        },
   
   category:{
         type: Schema.Types.ObjectId,
         ref:"categories",
         required:[true, "Please include a Category"]
     },

   price_after_discount: {
         type: Number,
         default: 0,
       },

   discount_per:{
         type: Number,
         default: 0,
     }
  },
{
timestamps: true,
}
)
module.exports = mongoose.model("items", items);