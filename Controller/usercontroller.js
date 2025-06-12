import bcrypt from 'bcrypt'
import crypto from 'crypto';
import nodemailer from "nodemailer";
import jwt from 'jsonwebtoken'
import user from '../Models/usermodel.js';
import { OAuth2Client } from "google-auth-library";
export const signincontroller = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const userdetail = await user.create({
      name,
      email,
      password: hashpassword,
      role
    });

    res.status(200).json({
      message: "User signup successfully",
      user: {
        id: userdetail._id,
        role: userdetail.role,
        email: userdetail.email,
        name: userdetail.name
      }
    });
  } catch (error) {
    res.status(500).json({ message: "User signup failed" });
  }
};

export const logincontroller = async(req , res)=>{
    try {
        const {email,password} = req.body;
        const emailfind = await user.findOne({email});
        if(!emailfind){
            return res.status(400).json({message :"user not found"})
        };
        
        const ismatch = await bcrypt.compare(password , emailfind.password);
        if(!ismatch){
            return res.status(400).json({message :"password not matched"})
        }

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
        res.status(500).json({message :"user login failed"})
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


export const forgotpassword = async(req, res) => {
  try {
    const {email} = req.body;
    
    const emailfind = await user.findOne({email});
    if(!emailfind) {
      return res.status(400).json({success: false, message: "User not found"});
    };
    
    const token = crypto.randomBytes(20).toString("hex");
    emailfind.resetToken = token;
    emailfind.resetTokenExpiry = Date.now() + 3600000;
    await emailfind.save();
    
   const resetlink = `https://inspiring-dodol-f165f9.netlify.app/reset-password/${token}`;

    
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "muhamedahamed251@gmail.com",
        pass: "yicg solz jrza back"
      }
    });
    
    await transport.sendMail({
      from: '"Your App Name" <muhamedahamed251@gmail.com>',
      to: emailfind.email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${resetlink}">here</a> to reset your password. This link will expire in 1 hour.</p>`
    });

    res.status(200).json({success: true, message: "Password reset email sent successfully"});
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({success: false, message: "Internal server error"});
  }
};

export const resetpassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newpassword } = req.body;

    const userfind = await user.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!userfind) {
      return res.status(400).json({ message: "Token expired or invalid" });
    }

    const hashpassword = await bcrypt.hash(newpassword, 10);

    userfind.password = hashpassword;
    userfind.resetToken = undefined;
    userfind.resetTokenExpiry = undefined;

    await userfind.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Password reset failed" });
  }
};

