const nodemailer = require('nodemailer');
const userSchema = require('.././model/user.model');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'creationbysagar@gmail.com', // your gmail id and below password of your mail
        pass: 'sagar123!'
    }
});

// send mail
module.exports.email = (req,res,next)=>{
    let otp = Math.floor(100000 + Math.random() * 900000);
    // console.log(req.body,otp);
    if(req.body.verifyoption == 'email' ){
        const otpValTime = Math.floor(Date.now() /1000) + 1*60;     // otp can be re-sent after 1 min 
        var mailOptions = {
            from: {
                name: 'Sagar',
                address: 'creationbysagar@gmail.com',
            },
            to: `${req.body.email}`,
            subject: 'Sending Mail to authenticate account',
            // text: 'Something went wrong'
            html: `<h2>Hi ${req.body.name},</h2><p>welcome to our site!</p><p>one time password (OTP) to ${req.body.for} is ${otp}.</p>`
        };
    
        userSchema.findById(req.body.id)
        .select('verified')
        .exec()
        .then( userResult=>{
            let userPrevOTPReceviceTime = Number(userResult.verified.split('.')[2]);
            // console.log(userPrevOTPReceviceTime - Math.floor(Date.now() /1000));
            if(userPrevOTPReceviceTime !== undefined && userPrevOTPReceviceTime > Math.floor(Date.now() /1000) ){
                let resendIn = userPrevOTPReceviceTime - Math.floor(Date.now() /1000);
                return res.status(403).json({
                    message: 'You have recently got an OTP,try after ' + resendIn + ' second(s)'
                })
            }
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    // console.log(error);
                    res.status(500).json({
                        message: 'Due to some error mail has not sent, try again',
                        error: error
                    })
                }else {
                    console.log('Email sent');
                    //update otp to db
                    userSchema.update({_id: req.body.id }, { $set: { verified: 'no.' + otp +'.' + otpValTime } } )
                    .exec()
                    .then( updateUser => {
                        // console.log(updateUser);
                        if(updateUser.nModified >= 1){
                            res.status(200).json({
                                message: 'A 6 digit OTP has successfully sent to the mail',
                                info: info,
                                result: info.response
                            })
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
            });   
        })
        // setTimeout( ()=>{
        //     res.status(200).json({
        //         message: 'A 6 digit OTP has successfully sent to the mail',
        //         // info: info,
        //         // result: info.response
        //     })
        // },1500 )
    }
}


// mail otp verify
module.exports.verifyemail = (req,res,next)=>{
    console.log(req.body);
    userSchema.findById(req.body.id)
    .select('verified')
    .exec()
    .then( userResult =>{
        let userOTP = userResult.verified.split('.')[1];
        if(req.body.OTP != undefined && req.body.OTP == userOTP ){
            console.log('otp verified & account created');
            userSchema.update({_id: req.body.id }, { $set: { verified: 'yes.0' } } )
            .then( updateUser => {
                // console.log(updateUser);
                if(updateUser.nModified >= 1){
                    res.status(200).json({
                        message: 'your account has verified,now you can login',
                    })
                }else{
                    res.status(403).json({
                        message: 'Some thing went wrong try again later'
                    })
                }
            })   
            .catch( err =>{
                res.status(500).json({
                    message: 'email not registered',
                    error: err
                })
            }) 
        }else{
            return res.status(403).json({
                message: 'OTP doesn\'t match,give correct OTP'
            })
        }
    })
}

module.exports.sendMail = (req,res,next)=>{
    let mailOptions = {
        from: {
            name: req.query.name,
            address: 'creationbysagar@gmail.com'
        },
        to: `${req.query.email}`,
        subject: 'Request to help a user',
        html: `<h2>Hi Agent,</h2><p>A new user wants to help you!<p><a href="http://localhost/Project1/Chatbot/chatByAgent.html?id=${req.query.id}">Click to start chat</a></p>`
    }
    transporter.sendMail(mailOptions,(err,info)=>{
        if(err){
            console.log(err);
            res.status(500).json({
                message: 'Due to some error mail has not sent, try again',
                error: err
            })
        }else{
            console.log('Email sent');
            res.status(200).json({
                message: 'Mail sent successful',
                info: info,
                result: info.response
            });
        }
    })
}

// https://myaccount.google.com/u/2/lesssecureapps?pli=1&rapt=AEjHL4O-Ez5YnWTiEn7cz7xqoopp7qsPiwQIYHnpGauh0q18L95924YJLyjD5-kuTiC4ttxJSctM5wZDBgM5-evj3BZM3egT9w
// above for less secure security on

// https://accounts.google.com/b/2/displayunlockcaptcha
// above for unlock display captcha
