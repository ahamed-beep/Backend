import express from 'express';
import { editshowdata, forgotpassword, goooglesignlogincontroller, logincontroller, resetpassword, showuserdata, signincontroller,  updateUserStatus } from '../Controller/usercontroller.js';
import {  adminCreateSubmission, deleteSubmission, getApprovedLetters, getApprovedPhotographs, getApprovedSubmissionById, getLetterSubmissions, getPhotographSubmissions, getsinglesubmissions, getsubmissionsdata, submissionfromdata, updatesubmission } from '../Controller/submissioncontroller.js';
import { contactsubmitcontroller, getcontactdatacontroller } from '../Controller/contactcontroller.js';
import { deleteProductById, getAllProducts, getFeaturedProductById, getFeaturedProducts, getProductById, getProductByIdForRecommendation, productaddcontroller, updateProductById } from '../Controller/productcontroller.js';
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
userroutes.route('/contact').post(contactsubmitcontroller);
userroutes.route('/getcontact').get(getcontactdatacontroller);
userroutes.route('/postproduct').post(productaddcontroller);
userroutes.route('/getproduct').get(getAllProducts);
userroutes.route('/singleproduct/:id').get(getProductById);
userroutes.route('/updateproduct/:id').put(updateProductById);
userroutes.route('/products/delete/:id').delete(deleteProductById);
userroutes.route('/featured').get(getFeaturedProducts);
userroutes.route('/getfeatured/:id').get(getFeaturedProductById);
userroutes.route('/recommendation/:id').get(getProductByIdForRecommendation);
userroutes.route('/getattachmentletters').get(getLetterSubmissions);
userroutes.route('/getattachmentphotographs').get(getPhotographSubmissions);
userroutes.route('/getapprovedletters').get(getApprovedLetters);
userroutes.route('/getapprovedphotographs').get(getApprovedPhotographs);
userroutes.route('/getapprovedsubmissions/:id').get(getApprovedSubmissionById);
userroutes.route('/submissionaddcontroller').post(adminCreateSubmission);
userroutes.route('/deletesubmission/:id').delete(deleteSubmission);











export default userroutes;

