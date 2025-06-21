import mongoose from "mongoose";

const contactmodel = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true
    },
     message:{
        type:String,
        required:true
    }
});

const contact = mongoose.model('contact' ,contactmodel);

export default contact;