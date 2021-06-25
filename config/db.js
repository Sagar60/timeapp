const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

//connect database
// mongoose.connect('mongodb://localhost:27017/user_logindb',{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,useFindAndModify: false });

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb://localhost:27017/user_logindb";
 
    const options = {
        useUnifiedTopology: true,
    }
    const client = new MongoClient(uri,options);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
