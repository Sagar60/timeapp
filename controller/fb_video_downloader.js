const fb_video_downloader = require('fb-video-downloader');
const fs = require('fs');
const url = require('url');


module.exports.fbLink = (req,res,next)=>{
    //var obj = url.parse(req.url);
    //console.log(req.path);
    fb_video_downloader.getInfo(req.query.url)
    .then( (result)=> {
        // const info = JSON.stringify(result,null,2)
        // res.render(__dirname + '/html/index.html',{sd: result.download.sd} );
        //console.log(result.download);
        res.status(200).json({
            information: result 
        });
    });
    //console.log('url '+req.query.url);
}

// app.post('/fb_vdo_download/',(req,res,next)=>{
//     console.log(req.body);
//     res.status(200).json({
//         success: 'yeah'
//     })
// })
