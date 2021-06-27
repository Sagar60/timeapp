const app = require('./index.js');
// server start module
const server = http.createServer(app);
const host = '0.0.0.0';
const port = process.env.PORT || 8080;
server.listen( port, ()=>{
    console.log(`server started at port:${port}`);
});
