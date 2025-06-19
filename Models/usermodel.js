import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmpassword: String,
  contactnumber: String,
  address: String,
  country: String,
  status: {
    type: String,
    default: 'null',
  },
  role: {
    type: String,
    default: 'user',
  },
  resetToken: String,           // ✅ corrected
  resetTokenExpiry: Date,       // ✅ corrected
});

const user = mongoose.model('user', userSchema);
export default user;
