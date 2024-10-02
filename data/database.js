import { MongoClient } from "mongodb";

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

let database;

async function connectToDatabase() {
  await client.connect();
  database = client.db('online-shop');
}

function getDb(){
    if(!database){
        throw new Error('you must connect first!');
    }

    return database;
}

export default {connectToDatabase, getDb};
