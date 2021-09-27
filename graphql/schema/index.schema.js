const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Booking {
    _id: ID!
    event: Event!
    patron: Patron!
    createdAt: String!
    updatedAt: String!
}

type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    creator: Admin!
}

type Admin {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
}

type Patron {
    _id: ID!
    email: String!
    password: String
}

input EventInput {
    title: String
    description: String!
    price: Float!
    date: String!
}

input AdminInput {
    email: String!
    password: String!
}

input PatronInput {
    email: String!
    password: String!
}

type RootQuery {
    events: [Event!]!
    bookings: [Booking!]!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createAdmin(adminInput: AdminInput): Admin
    createdPatron(patronInput: PatronInput): Patron
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)