import mongoose from "mongoose";

const usermodel = new mongoose.Schema({
    name:{
        type:String,
    },
     email:{
        type:String,
        unique:true
    },
     password:{
        type:String,
    },
     role:{
        type:String,
        default:'user'
    },
    resetToken: String,
  resetTokenExpiry: Date,
});

const user = mongoose.model('user' , usermodel);
export default user