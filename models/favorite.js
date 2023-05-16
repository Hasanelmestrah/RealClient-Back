const mongoose = require("mongoose");
const{Schema,model}=mongoose;


const favorites= new mongoose.Schema({
   name_fav:{
            type:String,
            // required:[true, 'Please add a product Name'],
        },
 
   image_fav: {
         public_id:{
            type: String,
            //required: true,
         },
         url:{
            type: String,
            //required: true,
         }
       },
   price_fav:{
           type: Number,
           
        },
  },
{
timestamps: true,
}
)
module.exports = mongoose.model("favorites", favorites);