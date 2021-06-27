  
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// const express = require('express');
// const app = express();

// static is used for any other folder need use in render files 

// app.use(express.static(__dirname+ '/first'));		// dist/'file package name'

// app.use(express.static(__dirname + '/first/html'))

// app.get('/',(req,res)=>{
//     res.send('Hello Sagar');
// })
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors());

app.use('/server',(rer,res,next)=>{
    res.status(200).json({
        message: 'hello server started'
    })
})

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
app.get('/cal/:op',(req,res,next)=>{
	// for html
	// app.set('views','view');
	// app.set('view engine','html');

	// app.use(express.static(__dirname + '/view'));
	
	// app.engine('html', require('ejs').renderFile);
	// app.set('view engine', 'html');

	// for pug
	app.set('views','view');
	//or app.set('views',__dirname +'/view');
	app.set('view engine','pug');

	let op = req.params.op;
	if(!op){
		return next();
	}
    let result = 0;
    const q1 = parseInt(req.query.q1);
    const q2 =  parseInt(req.query.q2);
    
	switch (op){
		case 'add':
			result = q1+q2;
			break;
		case 'sub':
			result = q1-q2;
			break;
		case 'mul':
			result = q1*q2;
			break;
		case 'div':
			result = q1/q2;
			break;
		default:
			result = q1+q2;
			break;
	}

    // res.send(`<h4>Result is =  ${result}<h4>`);
    res.render('test',{title: 'hello sagar', ip1: q1, ip2: q2, output: result,op: op});

});
app.post('/cal/:op',(req,res)=>{
	app.set('views','view');
	//or app.set('views',__dirname +'/view');
	app.set('view engine','pug');

	let result = 0;
    const q1 = parseInt(req.body.q1);
    const q2 =  parseInt(req.body.q2);
    const op = req.params.op ;
	switch (op){
		case 'add':
			result = q1+q2;
			break;
		case 'sub':
			result = q1-q2;
			break;
		case 'mul':
			result = q1*q2;
			break;
		case 'div':
			result = q1/q2;
			break;
		default:
			result = q1+q2;
			break;
	}
	console.log(op);

	res.render('index',{title: 'hi sagar', ip1: q1, ip2: q2, output: result,op: op});
	// res.send(req.params);
});

// app.get('/*',function(req,res) {
// 		res.sendFile(path.join(__dirname+'/first/')); 	//here also name change as per app name
// });

app.get('/*',function(req,res) {
	res.sendFile( 'index.html',{root: __dirname+'/first/html'} ); 	//here also name change as per app name
});

app.listen(process.env.PORT || 8080,()=>{
	console.log('server started at 8080');
});
