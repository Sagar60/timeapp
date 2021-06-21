const mongoose = require('mongoose');
const jsonewebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const userPicDIR = 'uploads/userProfilePics';
const userSchema = require('.././model/user.model');

let picOldPath = `D:\\angular\\Nodejs_practice\\uploads\\userDefaultPic\\userDefault.jpg`;
let picName =  Math.floor(Math.random(1000,9999)*10000) +'userDefault.jpg';
let picNewPath ='uploads\\userProfilePics\\' +  picName;

// register new user
exports.newUser_post = (req,res,next)=>{
    userSchema.find({ email: req.body.email })
    .exec()
    .then( user => {
        //console.log(user);
        if( user.length >= 1 ){
             res.status(409).json({
                message: 'The user already has an account here'
            })
        }else{
            bcrypt.hash( req.body.password,10, (err,hash) =>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                }else{
                    const newUser = new userSchema({
                        _id: mongoose.Types.ObjectId(),
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email:  req.body.email,
                        password: hash,
                        profileImageName: picName
                    });
                   // console.log(newUser);
                   fs.readFile(picOldPath, function (err, data) {
                        var imageName = picName;
                        /// If there's an error
                        // console.log(err, __userPicDIRname,picOldPath );
                        if(!imageName){
                            console.log("There was an error")
                            // res.reuserPicDIRect("/");
                            // res.end();
                        } else {
                        var newPath = picNewPath;
                        /// write file to uploads/fullsize folder
                        fs.writeFile(newPath, data, function (err) {
                            // console.log(err)
                        });
                        }
                    });
                    // fs.close();

                    newUser.save()
                    .then( result =>{
                        console.log(result._id);
                        return res.status(201).json({
                            message: 'user created',
                            user_id: result._id
                        });
                    })
                    .catch( err =>{
                        res.status(500).json({
                            message: 'user not created',
                            error: err
                        });
                    })
                }
            })
            }
        })
}

// authenticate for login
exports.loginUser_post = (req,res,next)=>{
    userSchema.findOne({ email: req.body.email })
    .exec()
    .then( user =>{
       // console.log(user);
        if( !user ){
            res.status(404).json({
                message: 'Auth failed',
            });
        }else{
            bcrypt.compare(req.body.password ,user.password, (err,result)=>{
                if(err){
                    res.status(500).json({
                        message: 'Auth failed',
                        error: err
                    });
                }if(result ){
                    verifiedornot = user.verified.split('.')[0];
                    req._id = user._id;
                    //token set
                    const token = jsonewebtoken.sign({
                        _id: user._id
                    },process.env.JWT_KEY,
                    {
                        expiresIn: process.env.EXPIRE_IN
                    })

                    return res.status(200).json({
                        message: 'Auth successful',
                        token: token,
                        id: user._id,
                        name: user.firstname,
                        verified: verifiedornot
                    })
                }
                return res.status(401).json({
                    message: 'Auth failed'
                });
            })
        }

    } )
    .catch( err=>{
        res.status(500).json({
            message: 'Auth failed',
            error: err
        });
    } )
}

// get user details
exports.getUserDetail_get =  (req,res,next)=>{
    let id = req.params.userId || req._id ;
    //console.log(id,req._id);
    userSchema.findOne({ _id: id })
    .select('firstname lastname email date profileImageName profileImageName')
    .exec()
    .then( user=> {
        if(!user){
            return res.status(404).json({
                message: 'user not found'
            })
        }else{
            res.status(200).json({
                userData: {
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    date: user.date,
                    profileImageName: user.profileImageName
                }
            })
            //profile pic location
        }
    })
    .catch( err=> {
        res.status(500).json({
            message: 'Details not found',
            error: err
        })
    })
}

// forgot pass control
exports.user_forgot_password = (req,res,next) =>{
    // console.log(req.body );
    userSchema.find({ email: req.body.email })
    .exec()
    .then( user =>{
        // console.log(user);
        if(user.length < 1){
            return res.status(401).json({
                message: 'You are not registered with us. Please sign up.'
            });
        }else{
            //console.log(req.body);
            // if otp is request by user
            if(req.body.req  === 'req OTP' ){
                if( user[0].OTPandExp.split('.')[1] > Math.floor(Date.now()/1000) + 3*60 ){
                    console.log('You have recently take an otp');
                    return res.status(401).json({
                        message: 'You have recently receive an otp'
                    });
                }else{
                    // console.log('otp ok');
                    let otp = Math.floor(100000 + Math.random() * 900000);
                    console.log('otp:- ' + otp);
                    const otpValTime = Math.floor(Date.now() /1000) + 5*60;
                    userSchema.update({_id: user[0]._id}, { $set: {  OTPandExp: otp + '.' + otpValTime } })
                    .exec()
                    .then( updateUser => {
                        // console.log(updateUser);
                        if(updateUser.nModified >= 1){
                            return res.status(200).json({
                                otp: otp,       // to generate 6 digit otp
                                message: 'OTP send'
                            });
                        }else{
                            return res.status(404).json({
                                message: 'Something went wrong,try again later'
                            });
                        }
                    })   
                    .catch( err =>{
                        res.status(500).json({
                            message: 'email not registered',
                            error: err
                        })
                    })  
                }
            }else if(req.body.req  === 'match OTP'){
            // if otp is needed to verify to the user
                // console.log('otp verify req receive');
                const userOtpMaxTime = user[0].OTPandExp.split('.')[1];
               const OTP = user[0].OTPandExp.split('.')[0];
                if( req.body.otp == OTP && userOtpMaxTime > Math.floor(Date.now()/1000)){
                    return res.status(200).json({
                        message: 'OTP has matched',
                        gotoSetpassword: true,
                        time: userOtpMaxTime
                    })
                }else if( req.body.otp != OTP ){
                    res.status(404).json({
                        message: 'OTP does not match'
                    })
                }
                else{
                    res.status(401).json({
                        message: 'This OTP has expired'
                    })
                }
            }else if(req.body.req  === 'update password'){
                // user password updating
                if(req.body.password === req.body.confirmpassword){
                    // console.log('update req');
                    bcrypt.hash( req.body.password,10, (err,hash) =>{
                        if(err){
                            return res.status(500).json({
                                message: 'An error Occur',
                                error: err
                            });
                        }else{
                            //console.log(user[0]._id);
                            bcrypt.compare(req.body.password ,user[0].password, (err,result)=>{
                                if(err){
                                    res.status(500).json({
                                        message: 'Auth failed',
                                        error: err
                                    });
                                }if(result){
                                    // if previous password and current is same
                                    return res.status(404).json({
                                        message: 'Previous password and new password cann\'t be same',
                                        error: err
                                    });
                                }
                                // if previous password and current is not same
                                userSchema.update({_id: user[0]._id}, { $set: { password: hash, OTPandExp: ''} })
                                .exec()
                                .then( updateUser => {
                                    // console.log(updateUser);
                                    if(updateUser.nModified >= 1){
                                        return res.status(200).json({
                                            message: 'User Password updated'
                                        });
                                    }else{
                                        return res.status(404).json({
                                            message: 'Something went wrong,try again later'
                                        });
                                    }
                                })   
                                .catch( err =>{
                                    res.status(500).json({
                                        message: 'email not registered',
                                        error: err
                                    })
                                })  
                                    

                            })  
                        }
                    })
                }else{
                    console.log('passowrd not matching');
                    res.status(404).json({
                        message: 'Password and confirm password does not match'
                    })
                }
            }
        }
    })
    
}

//user details update
exports.user_details_update = (req,res,next) =>{
    const id = req.params.userId;
    // if we want to change as per data values that receive in client end like only name or only price
    const updateOps = {};

    if(req.body.length !== undefined){
        for(const ops of req.body){
            updateOps[ops.propName] = ops.value;
        }
    }else{
        updateOps['firstname'] = req.body.firstname;
        updateOps['lastname'] = req.body.lastname;
        updateOps['profileImageName'] = req.body.profileImageName;
    }
    console.log(updateOps);

    userSchema.findById(id)
    .select('profileImageName')
    .exec()
    .then( user =>{
        if(user){
            // console.log(user);
            // user update query 
            userSchema.update({_id: req.params.userId}, { $set: updateOps })
            .exec()
            .then( updateUser =>{
                // console.log(updateUser)
                if(!updateUser){
                    return res.status(401).json({
                        message: 'User not found'
                    });
                }else{
                    try{
                        if( updateOps['profileImageName'] !== undefined  && updateOps['profileImageName'] !=='' ){
                            fs.unlinkSync(userPicDIR + '/'+ user.profileImageName );        // to delete previous image
                        }
                    }catch(err){
                        console.log(err, 'old pic not deleted');
                    }
                    return res.status(200).json({
                        message: 'user detail updated'
                    })
                }
            })
            .catch( err =>{
                return res.status(401).json({
                    error: err
                });
            })
        } else{
            return res.status(401).json({
                message: 'User not found'
            });
        }
        
    })
    
}

// delete user
exports.deleteUser =  (req,res,next) =>{
    let imageName = '';
    userSchema.findById(req.params.userId)
    .select('profileImageName')
    .exec()
    .then( user =>{
        if(user){
            imageName = user.profileImageName
            //console.log(user)
        }
        // console.log( imageUrl,imageName )
        userSchema.remove({_id: req.params.userId})
        .exec()
        .then( result=> {
            console.log(result);
            if(result.deletedCount >=1){
                try{
                    if(imageName !=='' ){
                        fs.unlinkSync(userPicDIR + '/'+ imageName);        // to delete previous image
                    }
                }catch(err){
                    console.log(err);
                }

                res.status(200).json({
                    message: 'user deleted'
                });
            }else{
                res.status(404).json({
                    message: 'user not found'
                });
            }
            })
            .catch( err =>{
                res.status(500).json({
                    message: 'Auth failed',
                    error: err
                });
            });
    })
}

// *****
// in router if find method you used then it will return an array based prop
// in router if findOne method you used then it will return an object based prop