const Event = require('../../models/event');
const Admin = require('../../models/admin');
const Patron = require('../../models/patron');
const { dateToString } = require('../../helpers/date');

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return transformEvent(event);
        });
    } catch (err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
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

const transformTicket = ticket => {
    return {
        ...ticket._doc,
        _id: ticket.id,
        patron: patron.bind(this, ticket._doc.user),
        event: singleEvent.bind(this, ticket._doc.event),
        createdAt: dateToString(ticket._doc.createdAt),
        updatedAt: dateToString(ticket._doc.updatedAt),
    };
};

const transformEvent = event => {
    return {
        ...event._doc,
        _id: event.id,
        date: dateToString(event._doc.date),
        creator: admin.bind(this, event.creator)
    };
};

// exports.admin = admin;
// exports.events = events;
// exports.singleEvent = singleEvent;
exports.transformTickets = transformTicket;
exports.transformEvent = transformEvent;