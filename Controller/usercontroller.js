import bcrypt from 'bcrypt'
import crypto from 'crypto';
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken'
import user from '../Models/usermodel.js';
import { OAuth2Client } from "google-auth-library";
export const signincontroller = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      confirmpassword,
      contactnumber,
      address,
      country,
      role,
      status
    } = req.body;

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const hashConfirmPassword = await bcrypt.hash(confirmpassword, 10); // optional

    const userdetail = await user.create({
      firstname,
      lastname,
      email,
      password: hashPassword,
      confirmpassword: hashConfirmPassword, // optional
      contactnumber,
      address,
      country,
      role,
      status: 'null'
    });

    res.status(200).json({
      message: "User signup successfully",
      user: {
        id: userdetail._id,
        email: userdetail.email,
        role: userdetail.role,
        firstname: userdetail.firstname,
        lastname: userdetail.lastname,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "User signup failed", error });
  }
};

export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailfind = await user.findOne({ email });
    if (!emailfind) {
      return res.status(400).json({ message: "User not found" });
    }

    const ismatch = await bcrypt.compare(password, emailfind.password);
    if (!ismatch) {
      return res.status(400).json({ message: "Password not matched" });
    }

    // Check status
    if (emailfind.status === 'null') {
      return res.status(403).json({ message: "Waiting for admin approval" });
    }

    if (emailfind.status === "rejected") {
      return res.status(403).json({ message: "You have been rejected by admin" });
    }

    // Status approved: proceed with login
    const token = jwt.sign(
      { id: emailfind._id },
      "myTempSecretKey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      token,
      id: emailfind._id,
      role: emailfind.role,
    });

  } catch (error) {
    res.status(500).json({ message: "User login failed" });
  }
};

const client = new OAuth2Client(
  "371076891085-5op51naiscmt9ibv0uhsfcvf5qrjgm31.apps.googleusercontent.com"
);

export const goooglesignlogincontroller = async (req, res) => {
 try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || "371076891085-5op51naiscmt9ibv0uhsfcvf5qrjgm31.apps.googleusercontent.com",
    });

    const { name, email, sub: googleId } = ticket.getPayload();

    // Check if user exists by email OR googleId
    let userfind = await user.findOne({ $or: [{ email }, { googleId }] });

    if (!userfind) {
      userfind = await user.create({
        name,
        email,
        googleId,
        password: null,
        confirmpassword: null,
        contactnumber: null,
        address: null,
        country: null,
        status: null,
        role: "user",
      });
    }

    const jwtToken = jwt.sign(
      { id: userfind._id },
      process.env.JWT_SECRET || "myTempSecretKey",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Google login successful",
      token: jwtToken,
      user: {
        _id: userfind._id,
        name: userfind.name,
        email: userfind.email
      }
    });

  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({ 
      message: "Google authentication failed",
      error: error.message 
    });
  }
};


export const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;

    const emailfind = await user.findOne({ email });
    if (!emailfind) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    emailfind.resetToken = token; // ✅ renamed field
    emailfind.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await emailfind.save();

    const resetlink = `http://localhost:5173/reset-password/${token}`;

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "muhamedahamed251@gmail.com",
        pass: "yicg solz jrza back",
      }
    });

    await transport.sendMail({
      from: '"Your App Name" <muhamedahamed251@gmail.com>',
      to: emailfind.email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetlink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    });

    res.status(200).json({ success: true, message: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const resetpassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newpassword } = req.body;

    const userfind = await user.findOne({
      resetToken: token, // ✅ correct field
      resetTokenExpiry: { $gt: Date.now() }, // ✅ correct field
    });

    if (!userfind) {
      return res.status(400).json({ message: "Token expired or invalid" });
    }

    const hashpassword = await bcrypt.hash(newpassword, 10);
    userfind.password = hashpassword;
    userfind.resetToken = undefined;        // ✅ clear after use
    userfind.resetTokenExpiry = undefined;  // ✅ clear after use

    await userfind.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Password reset failed" });
  }
};



export const showuserdata = async(req , res)=>{
  try {
    const data = await user.find();
    if(!data){
      res.status(400).json({message :"data not found"})
    }
    res.status(200).json({message :"user get successfully" , data})
  } catch (error) {
    res.status(500).json({message :"failed to get"})
  }
};

export const editshowdata = async(req , res)=>{
  try {
    const {id} = req.params;
    const finduser = await user.findById(id)
    if(!finduser){
      res.status(400).json({message :"data not found"})

    };
    res.status(200).json({message :"user get successfully" , finduser})

  } catch (error) {
    res.status(500).json({message :"failed to get"})
    
  }
};


export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

  const updatedUser = await user.findByIdAndUpdate(id, { status }, { new: true });


    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "muhamedahamed251@gmail.com",
        pass: "yicg solz jrza back", // App password
      },
    });

    let subject = '';
    let html = '';

    if (status === 'approved') {
      subject = "Your Account Has Been Approved";
      html = `<p>Congratulations! Your account has been approved. You can now <a href="https://inspiring-dodol-f165f9.netlify.app/login">login here</a>.</p>`;
    } else if (status === 'rejected') {
      subject = "Your Account Has Been Rejected";
      html = `<p>Sorry, your registration request has been rejected by the admin. Please contact support for more details.</p>`;
    }

    // Send email only if status is approved or rejected
    if (status === 'approved' || status === 'rejected') {
      await transport.sendMail({
        from: '"Admin Panel" <muhamedahamed251@gmail.com>',
        to: updatedUser.email,
        subject,
        html,
      });
    }

   res.status(200).json({
  message: `User status updated to ${status}`,
  user: updatedUser,
});


  } catch (error) {
    console.error("Status update error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


