const Event = require('../../models/event');
const User = require('../../models/user');
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

const user = async userId => {
    try {
        const user = await User.findById(userId)
        return {
            ...user._doc,
            _id: user.id,
            boughtTickets: events.bind(this, user._doc.boughtTickets)
        };
    } catch (err) {
        throw err;
    };
};

const transformTicket = ticket => {
    return {
        ...ticket._doc,
        _id: ticket.id,
        user: user.bind(this, ticket._doc.user),
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
        creator: user.bind(this, event.creator)
    };
};

exports.transformTickets = transformTicket;
exports.transformEvent = transformEvent;