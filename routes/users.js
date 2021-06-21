const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const checkAuth = require('../controller/tokenverify');
const userControl = require('../controller/user.Controller');
const userVerifyController = require('../controller/emailsenderController');

router.post('/signup', userControl.newUser_post);

router.post('/login', userControl.loginUser_post);

router.post('/sendmail', userVerifyController.email );

router.post('/verifymail', userVerifyController.verifyemail );


router.get('/:userId', checkAuth , userControl.getUserDetail_get );

router.post('/forgotpassword', userControl.user_forgot_password );

router.patch('/:userId', checkAuth , userControl.user_details_update);

router.delete('/:userId',checkAuth, userControl.deleteUser );


module.exports = router;
