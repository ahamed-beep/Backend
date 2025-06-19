import mongoose from "mongoose";

const submissionmodel = new mongoose.Schema({
    title:{
        type:String,
        reqiored:true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    phone2: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    socialmedia: {
        type: String
    },
    guadianowner: {
        type: String,
        required: true
    },
    attachment: {
        type: String,
        required: true
    },
    otherspecify: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    dateimage: {
        type: String,  // Keeping as String to match frontend date input
        required: true
    },
    placeimage: {
        type: String,
        required: true
    },
    photographcaptain: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    narrative: {
        type: String,
        required: true
    },
    imageadded: {
        type: String,
        required: true
    },
    imagebefore: {
        type: String,
        required: true
    },
    termsandcondition: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    status:{
        type:String,
        default:"Pending"
    },
    admindescription:{
         type:String,
        default:"null"
    }
}, { timestamps: true });

const submissions = mongoose.model('submissions' , submissionmodel);

export default submissions