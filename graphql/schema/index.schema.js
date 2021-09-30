const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Booking {
    _id: ID!
    event: Event!
    patron: Patron!
    totalPax: Int!
    table: Int!
    createdAt: String!
    updatedAt: String!
}

type Event {
    _id: ID!
    title: String!
    time: String!
    date: String!
    totalPax: Int!
    img: String!
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

type AuthAdminData {
    adminId: ID!
    token: String!
    tokenExpiration: Int!
}

type AuthPatronData {
    patronId: ID!
    token: String!
    tokenExpiration: Int!
}

input EventInput {
    title: String
    time: String!
    date: String!
    totalPax: Int!
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
    adminLogin(email: String!, password: String!): AuthAdminData!
    patronLogin(email: String!, password: String!): AuthPatronData!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createAdmin(adminInput: AdminInput): Admin
    createPatron(patronInput: PatronInput): Patron
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)