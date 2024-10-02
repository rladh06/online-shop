import mongoDbStore from "connect-mongodb-session";
import expressSession from "express-session";

function createSessionStore(){
    const MongoDBStore = mongoDbStore(expressSession);

    const store = new MongoDBStore({
        uri: 'mongodb://localhost:27017',
        databaseName: 'online-shop',
        collection: 'sessions'
    });

    return store;
}

export default function createSessionConfig(){
    return {
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 2* 24 * 60 * 1000
        }
    };
}



