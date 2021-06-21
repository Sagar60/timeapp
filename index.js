const express = require('express');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');       // morgan use to see what api use toin client site and for how long it give response
const cors = require('cors');
const checkAuth = require('./controller/tokenverify');

require('./config/config');
require('./config/db');

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// user sign up

// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','*')      // * ->for which browser u want to access to serve
//     res.header('Access-Control-Allow-Header','*');
//     if(req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Methods','PUT,POST,GET,PATCH,DELETE');
//         res.status(200).json({});
//     }
//     next();     // important to give this
// });

// 

const userService = require('./routes/users');
const picCotroller = require('./controller/pic.controller');

app.use('/upload', express.static('uploads'))
app.use('/user',userService );
app.use('/pics',picCotroller.pic_updateRouter);
app.use('/servercheck',(req,res,next)=>{
    res.json({
        message: 'server started at port:4000'
    })
})

app.use((req,res,next)=>{
    const error = new Error('There has a problem');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status( error.status || 500 );
    res.json({
        error: {
            message: error.message
        }
    })
})

// server start module
const server = http.createServer(app);
const port = 4000
server.listen( port,()=>{
    console.log(`server started at port:${port}`);
})