const bcrypt = require('bcryptjs');

const Event = require('../../models/event');
const Admin = require('../../models/admin');
const Patron = require('../../models/patron')
const Booking = require('../../models/booking');

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                creator: admin.bind(this, event.creator)
            };
        });
        return events;
    } catch (err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return {
            ...event._doc,
            _id: event.id,
        };
    } catch (err) {
        throw err
    };
};

const admin = async adminId => {
    try {
        const admin = await Admin.findById(adminId)
        return {
            ...admin._doc,
            _id: admin.id,
            createdEvents: events.bind(this, admin._doc.createdEvents)
        };
    } catch (err) {
        throw err;
    };

    const patron = async patronId => {
        try {
            const patron = await Patron.findById(patronId)
            return {
                ...patron._doc,
                _id: patron.id,
            };
        } catch (err) {
            throw err;
        };
    };

    module.exports = {
        events: async () => {
            try {
                const events = await Event.find()

                return events.map(event => {
                    return {
                        ...event._doc,
                        _id: event.id,
                        date: new Date(event._doc.date).toISOString(),
                        creator: admin.bind(this, event._doc.creator)
                    };
                });
            } catch (err) {
                throw err;
            };
        },
        bookings: async () => {
            try {
                const bookings = await Booking.find();
                return bookings.map(booking => {
                    return {
                        ...booking._doc,
                        _id: booking.id,
                        patron: patron.bind(this, booking._doc.user),
                        event: singleEvent.bind(this, booking._doc.event),
                        createdAt: new Date(booking._doc.createdAt).toISOString(),
                        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                    }
                })

            } catch (err) {
                throw err;
            }
        },
        createEvent: async (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: '614afd301544143587a0939f'
            });
            let createdEvent;
            try {
                const result = await event
                    .save()

                createdEvent = {
                    ...result._doc,
                    _id: event.id.toString(),
                    date: new Date(event._doc.date).toISOString(),
                    creator: admin.bind(this, result._doc.creator)
                };
                const creator = await Admin.findById('614afd301544143587a0939f')
                console.log(result);

                if (!creator) {
                    throw new Error('User not found');
                }
                creator.createdEvents.push(event);
                await creator.save();
                return createdEvents;
            } catch (err) {
                console.log(err)
                throw err;
            };
        },
        createAdmin: async (args) => {
            try {
                const existingAdmin = await Admin.findOne({ email: args.adminInput.email })
                if (existingAdmin) {
                    throw new Error('User exists already.');
                }
                const hashedPassword = await bcrypt.hash(args.adminInput.password, 12);

                const admin = new Admin({
                    email: args.adminInput.email,
                    password: hashedPassword
                });
                const result = await admin.save();

                console.log(result);
                return { ...result._doc, password: null, id: result.id };
            } catch (err) {
                console.log(err);
                throw err;
            };
        },
        createPatron: async (args) => {
            try {
                const existingPatron = await Patron.findOne({ email: args.patronInput.email })
                if (existingPatron) {
                    throw new Error('User exists already.');
                }
                const hashedPassword = await bcrypt.hash(args.patronInput.password, 12);

                const patron = new Patron({
                    email: args.patronInput.email,
                    password: hashedPassword
                });
                const result = await patron.save();

                console.log(result);
                return { ...result._doc, password: null, id: result.id };
            } catch (err) {
                console.log(err);
                throw err;
            };
        },
        bookEvent: async (args) => {
            try {
                const fetchedEvent = await Event.findOne({ _id: args.eventId });
                const booking = new Booking({
                    patron: '614afd301544143587a0939f',
                    event: fetchedEvent
                });
                const result = await booking.save();
                return {
                    ...result._doc,
                    _id: result.id,
                    patron: patron.bind(this, booking._doc.user),
                    event: singleEvent.bind(this, booking._doc.event),
                    createdAt: new Date(result._doc.createdAt).toISOString(),
                    updatedAt: new Date(result._doc.updatedAt).toISOString(),
                }
            } catch (err) {
                throw err;
            }
        },
        cancelBooking: async args => {
            try {
                const booking = await Booking.findById(args.bookingId).populate('event');
                const event = { ...booking.event._doc, _id: booking.event.id };
                await Booking.deleteOne({ _id: argsBookingId });
                return event;
            } catch (err) {
                throw err;
            }
        }
    };
};