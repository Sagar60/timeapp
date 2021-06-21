const express = require('express');
const app = express();
const morgan = require('morgan');       // morgan use to see what api use toin client site and for how long it give response
const bodyParser = require('body-parser');
const mongoose = require('mongoose') ;
const fs = require('fs');
const http = require('http');

// for mongo altas connect code
// mongoose.connect('mongodb+srv://node-sagar:'+ process.env.MONGO_ATLAS_PW  +'@cluster0.l8zx9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
// { useNewUrlParser: true })

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://node-sagar:"+ "af00OBssyYFNBm0m" + "@cluster0.l8zx9.mongodb.net/testDB?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("testDB").collection("prod");
//   // perform actions on the collection object
//   client.close();
// });

// here process.env.MONGO_ATLAS_PW  -> af00OBssyYFNBm0m as a password
 
// for mongo compass offline connect tool code

// mongoose.connect('mongodb://localhost:27017/timeoutappServer',{useNewUrlParser: true, useUnifiedTopology: true})

// app.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','*')      // * ->for which browser u wabt to access to serve
//     res.header('Access-Control-Allow-Header','*');
//     if(req.method === 'OPTIONS'){
//         res.header('Access-Control-Allow-Methods','PUT,POST,GET,PATCH,DELETE');
//         res.status(200).json({});
//     }
//     next();     // important to give this
// })


// const productsRoutes = require('./api/routes/products');
// const ordersRoutes = require('./api/routes/orders');
const userRoutes = require('./routes/users')

// app.use((req,res,next) => {
//     res.status(200).json({
//         message: 'It works!',
//     });
// });

app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));      // to use upload folder in globally
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

// app.use('/products', productsRoutes );
// app.use('/orders',ordersRoutes);
app.use('/user',userRoutes)

app.use((req,res,next) =>{
    const error = new Error('Item not found error');
    error.status = 404 ;
    next(error);
})

app.use((error,req,res,next) =>{        // error handling from anywhere 
    res.status(error.status || 500 );
    res.json({
        error: {
            message: error.message
        }
    });
})

// app.listen(3000,()=>{
//     console.log('Server start at 3000 port');
// })


//cors - Cross Origin Resource Sharing
// for cors No access-control error comes
// connection between two diff server like localhost:3000 and localhost: 4000 they not fetch that both are same so that cors used

// multer -> use for accept the image from form-data body

// server start module
const server = http.createServer(app);
const port = 4040;
server.listen( port,()=>{
    console.log(`server started at port:${port}`);
})