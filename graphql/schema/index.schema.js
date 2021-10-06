const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Ticket {
    _id: ID!
    event: Event!
    patron: Patron!
    createdAt: String!
    updatedAt: String!
}

type Image {
    _id: ID!
    fileLocation: String!
}

type Event {
    _id: ID!
    title: String!
    date: String!
    description: String!
    image: [Image!]
    price: Float!
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
    date: String!
    description: String!
    price: Float!
    image: [Image!]
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
    tickets: [Ticket!]!
    adminLogin(email: String!, password: String!): AuthAdminData!
    patronLogin(email: String!, password: String!): AuthPatronData!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createAdmin(adminInput: AdminInput): Admin
    createPatron(patronInput: PatronInput): Patron
    buyTicket(eventId: ID!): Ticket!
    cancelTicket(ticketId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)