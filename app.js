const graphqlUploadExpress = require('graphql-upload').graphqlUploadExpress;
const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');
const isAuth = require('./middleware/is-auth.middleware');

const graphQlSchema = require('./graphql/schema/index.schema');
const graphQlResolvers = require('./graphql/resolvers/index.resolver');


const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(isAuth);

// graphql schema
app.use(
    '/graphql',
    graphqlUploadExpress({ maxFieldSize: 10000000, maxFiles: 10 }),
    graphqlHTTP({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    }));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.y3m48.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`).then(() => {
    app.listen(8000);
}).catch(err => {
    console.log(err);
});