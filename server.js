  
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


require('./config/config');
require('./config/db');

// const express = require('express');
// const app = express();

// static is used for any other folder need use in render files 

// app.use(express.static(__dirname+ '/first'));		// dist/'file package name'

// app.use(express.static(__dirname + '/first/html'))

// app.get('/',(req,res)=>{
//     res.send('Hello Sagar');
// })

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const userService = require('./routes/users');
const picCotroller = require('./controller/pic.controller');

app.use('/upload', express.static('uploads'))
app.use('/user',userService );
app.use('/pics',picCotroller.pic_updateRouter);
app.use('/server',(req,res,next)=>{
    console.log('hh');
    res.json({
        message: 'Hello! server has started'
    })
});

app.get('/cal',(req,res)=>{
    let result = 0;
    const q1 = parseInt(req.query.q1);
    const q2 = parseInt(req.query.q2)
    result = q1+q2;
    res.send(`
        <h3> Answer is ${result} </h3>
    `
    );
});
app.get('/*',function(req,res) {
	res.sendFile( 'index.html',{root: __dirname+'/first/html'} ); 	//here also name change as per app name
});

app.listen(process.env.PORT || 8080,()=>{
	console.log('server started at 8080');
});
