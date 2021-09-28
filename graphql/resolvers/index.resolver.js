const authResolver = require('./auth.resolver');
const bookingResolver = require('./bookings.resolver');
const eventResolver = require('./events.resolver');

const rootResolver = {
    ...authResolver,
    ...bookingResolver,
    ...eventResolver
};

module.exports = rootResolver;