  
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const checkAuth = require('./controller/tokenverify');

//require('./config/config');
require('./config/db');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

const userService = require('./routes/users');
const picCotroller = require('./controller/pic.controller');
const extraWorks = require('./routes/extrawors');

app.use('/upload', express.static('uploads'))
app.use('/user',userService );
app.use('/pics',picCotroller.pic_updateRouter);
app.use('/extra',extraWorks);

app.use('/server',(req,res,next)=>{
    console.log('hh');
    res.json({
        message: 'Hello! server has started'
    })
});

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
});

app.get('/*',function(req,res) {
	res.sendFile( 'index.html',{root: __dirname+'/first/html'} ); 	//here also name change as per app name
});

app.listen(8080,()=>{
	console.log('server started at 8080');
});
