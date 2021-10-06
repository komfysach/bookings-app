const Ticket = require('../../models/tickets');
const Event = require('../../models/event');
const Patron = require('../../models/patron');
const { transformTicket, transformEvent } = require('./merge.resolver');
const bcrypt = require('bcryptjs');

module.exports = {
    tickets: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }
        try {
            const tickets = await ticket.find();
            return tickets.map(ticket => {
                return transformTicket(ticket);
            })

        } catch (err) {
            throw err;
        }
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
    bookEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }
        try {
            const fetchedEvent = await Event.findOne({ _id: args.eventId });
            const ticket = new Ticket({
                patron: req.patronId,
                event: fetchedEvent
            });
            const result = await ticket.save();
            return transformTicket(result);
        } catch (err) {
            throw err;
        }
    },
    cancelTicket: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }
        try {
            const ticket = await Ticket.findById(args.ticketId).populate('event');
            const event = transformEvent(ticket.event);
            await Ticket.deleteOne({ _id: argsTicketId });
            return event;
        } catch (err) {
            throw err;
        }
    }
};