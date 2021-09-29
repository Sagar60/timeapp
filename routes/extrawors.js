const express=require('express');
const router=express.Router();
const linkExtractController=require('../controller/fb_video_downloader'); 

router.get('/fb_video_download',linkExtractController.fbLink);

module.exports = router;