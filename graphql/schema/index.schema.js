const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type Ticket {
    _id: ID!
    event: Event!
    patron: Patron!
    createdAt: String!
    updatedAt: String!
}

type Role {
    roles: [String]!
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
    creator: [User!]
}

type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    boughtTickets: [Event!]
}

type UserPref {
    name: String!
    email: String!
  }

type AuthData {
    userId: ID!
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

input UserInput {
    name: String!
    email: String!
    password: String!
}

type RootQuery {
    events: [Event!]!
    tickets: [Ticket!]!
    userLogin(email: String!, password: String!): AuthData!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    updateUser(name: String!, email: String!, password: String!): UserPref
    updateUserAdmin(userId: ID!, roles: [String!]!): Role
    buyTicket(eventId: ID!): Ticket!
    cancelTicket(ticketId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)