const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema/index.schema');
const graphQlResolvers = require('./graphql/resolvers/index.resolver');

const app = express();

app.use(bodyParser.json());

// graphql schema
app.use(
    '/graphql',
    graphqlHTTP({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    }));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.y3m48.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`).then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
