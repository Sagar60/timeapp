const app = require('./index');
const http = require('http');

// server start module
const server = http.createServer(app);
const port = 4000;

server.listen( port, ()=>{
    console.log(`server started at port:${port}`);
});
