const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Event = require('./models/event');
const Admin = require('./models/admin');

const app = express();

app.use(bodyParser.json());

const admin = adminId => {
    return Admin.findById(userId)
        .then(user => {
            return { ...user._doc, _id: user.id };
        })
        .catch(err => {
            throw err;
        });
}

// graphql schema
app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`
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
            createdEvents: [Events!]
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

        type RootQuery {
            events: [Event!]!

        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createAdmin(adminInput: AdminInput): Admin

        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
        rootValue: {
            events: () => {
                return Event.find()
                    .then(events => {
                        return events.map(event => {
                            return { ...event._doc, _id: event.id, creator: admin.bind(this, event._doc.creator) };
                        });
                    }).catch(err => {
                        throw err;
                    });
            },
            createEvent: (args) => {
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date),
                    creator: '614afd301544143587a0939f'
                });
                let createdEvent;
                return event.save().then(result => {
                    createdEvent = { ...result._doc, _id: event.id.toString() };
                    return Admin.findById('614afd301544143587a0939f')
                    console.log(result);

                })
                    .then(admin => {
                        if (!admin) {
                            throw new Error('User not found');
                        }
                        admin.createdEvents.push(event);
                        return admin.save();
                    })
                    .then(result => {
                        return createdEvent;
                    })
                    .catch(err => {
                        console.log(err);
                        throw err;
                    });
            },
            createAdmin: (args) => {
                return Admin.findOne({ email: args.adminInput.email }).then(admin => {
                    if (admin) {
                        throw new Error('User exists already.');
                    }
                    return bcrypt.hash(args.adminInput.password, 12);
                })
                    .then(hashedPassword => {
                        const admin = new Admin({
                            email: args.adminInput.email,
                            password: hashedPassword
                        });
                        return admin.save();
                    })
                    .then(result => {
                        console.log(result);
                        return { ...result._doc, password: null, id: result.id };
                    }).catch(err => {
                        console.log(err);
                        throw err;
                    });
            }
        },
        graphiql: true
    }));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.y3m48.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`).then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});
