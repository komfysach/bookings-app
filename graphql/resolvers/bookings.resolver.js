const Booking = require('../../models/booking');
const Event = require('../../models/event');
const Patron = require('../../models/patron');
const { transformBooking, transformEvent } = require('./merge.resolver');
const bcrypt = require('bcryptjs');

module.exports = {
    bookings: async(args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return transformBooking(booking);
            })

        } catch (err) {
            throw err;
        }
    },
    createPatron: async(args) => {
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
            return {...result._doc, password: null, id: result.id };
        } catch (err) {
            console.log(err);
            throw err;
        };
    },
    bookEvent: async(args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            const booking = new Booking({
                patron: req.patronId,
                event: fetchedEvent
            });
            const result = await booking.save();
            return transformBooking(result);
        } catch (err) {
            throw err;
        }
    },
    cancelBooking: async(args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: argsBookingId });
            return event;
        } catch (err) {
            throw err;
        }
    }
};