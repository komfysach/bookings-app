const GraphQLUpload = require('graphql-upload').GraphQLUpload;

const authResolver = require('./auth.resolver');
const ticketResolver = require('./tickets.resolver');
const eventResolver = require('./events.resolver');
const imageResolver = require('./images.resolver');

const rootResolver = {
    Upload: GraphQLUpload,
    ...authResolver,
    ...ticketResolver,
    ...eventResolver,
    ...imageResolver
};

module.exports = rootResolver;