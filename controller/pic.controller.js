const express = require('express');
const multer = require('multer');
const router = express.Router();
const checkAuth = require('./tokenverify');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'uploads/userProfilePics/');        // error, destination
    },
    filename: (req,file,cb)=>{
        cb(null, file.originalname)
    }
});

const fileFilter = (req,file,cb) =>{
    // console.log(file);
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
        cb(null,true);
    }else{
        cb(new Error('This file type don\'t supported'),false );
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5*1024*1024        
    },
    fileFilter: fileFilter
});


router.patch('/', upload.single('uploadImage'), (req,res,next)=>{
    console.log('uploadpic worked');
    // return res.status(200).json({
    //     message: 'update now'
    // })
    // next();
})

exports.pic_uploadHelper = upload.single('uploadImage');

exports.pic_updateRouter = router;
