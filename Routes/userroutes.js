import express from 'express';
import { editshowdata, forgotpassword, goooglesignlogincontroller, logincontroller, resetpassword, showuserdata, signincontroller,  updateUserStatus } from '../Controller/usercontroller.js';
import { getsinglesubmissions, getsubmissionsdata, submissionfromdata, updatesubmission } from '../Controller/submissioncontroller.js';
const userroutes = express.Router();
userroutes.route('/sign').post(signincontroller);
userroutes.route('/login').post(logincontroller);
userroutes.route('/google').post(goooglesignlogincontroller);
userroutes.route('/forgot-password').post(forgotpassword);
userroutes.route('/reset-password/:token').post(resetpassword);
userroutes.route('/userdetail').get(showuserdata);
userroutes.route('/getsingle/:id').get(editshowdata);
userroutes.route('/update/:id').put(updateUserStatus);
userroutes.route('/sub').post(submissionfromdata);
userroutes.route('/getsub').get(getsubmissionsdata); 
userroutes.route('/singlesub/:id').get(getsinglesubmissions);
userroutes.route('/updatesub/:id').put(updatesubmission);










export default userroutes;

