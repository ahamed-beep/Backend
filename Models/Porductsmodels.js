import mongoose, { mongo }  from "mongoose"
const productmodel = new mongoose.Schema({
title:{
    type:String,
    required:true
},
price: {
  type: Number,
  required: true
},

description:{
    type:String,
    required:true
},
image1:{
    type:String,
    required:true
},
image2:{
    type:String,
    required:true
},
image3:{
    type:String,
    required:true
},
image4:{
    type:String,
    required:true
},
featuredproduct:{
     type:String,
   default:'false'
}
});

const productsdata = mongoose.model("product" , productmodel);
export default productsdata
