const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

var uri = "mongodb://node_sagar:dtyqqQckw9VKKqqA@cluster0-shard-00-00.l8zx9.mongodb.net:27017,cluster0-shard-00-01.l8zx9.mongodb.net:27017,cluster0-shard-00-02.l8zx9.mongodb.net:27017/timeapp?ssl=true&replicaSet=atlas-fa4gx5-shard-0&authSource=admin&retryWrites=true&w=majority&keepAlive=true&poolSize=30&socketTimeoutMS=360000&connectTimeoutMS=360000";

// var uri = "mongodb://localhost:27017/user_logindb"  // localhost mongodb 

//connect database
mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,useFindAndModify: false });

// async function main(){
//     /**
//      * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
//      * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
//      */
//     //  dtyqqQckw9VKKqqA        // password
//     // const uri = "mongodb+srv://node_sagar:dtyqqQckw9VKKqqA@cluster0.l8zx9.mongodb.net/timeapp?retryWrites=true&w=majority";
 
//     var uri = "mongodb://node_sagar:dtyqqQckw9VKKqqA@cluster0-shard-00-00.l8zx9.mongodb.net:27017,cluster0-shard-00-01.l8zx9.mongodb.net:27017,cluster0-shard-00-02.l8zx9.mongodb.net:27017/timeapp?ssl=true&replicaSet=atlas-fa4gx5-shard-0&authSource=admin&retryWrites=true&w=majority&keepAlive=true&poolSize=30&socketTimeoutMS=360000&connectTimeoutMS=360000";
    
//     // var uri = "mongodb://localhost:27017/user_logindb"  // localhost mongodb 

//     const options = {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useFindAndModify: false,
//         useCreateIndex: true
//     }
//     const client = new MongoClient(uri,options);
 
//     try {
//         // Connect to the MongoDB cluster
//         await client.connect();
 
//         // Make the appropriate DB calls
//         await  listDatabases(client);
 
//     } catch (e) {
//         console.error(e);
//     } finally {
//         await client.close();
//     }
// }

// main().catch(console.error);

// async function listDatabases(client){
//     databasesList = await client.db().admin().listDatabases();
 
//     console.log("Databases:");
//     databasesList.databases.forEach(db => console.log(` - ${db.name}`));
// };
