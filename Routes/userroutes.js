import express from 'express';
import { forgotpassword, goooglesignlogincontroller, logincontroller, resetpassword, signincontroller } from '../Controller/usercontroller.js';
const userroutes = express.Router();
userroutes.route('/sign').post(signincontroller);
userroutes.route('/login').post(logincontroller);
userroutes.route('/google').post(goooglesignlogincontroller);
userroutes.route('/forgot-password').post(forgotpassword);
userroutes.route('/reset-password/:token').post(resetpassword);


export default userroutes;
