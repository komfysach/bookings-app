const { dateToString } = require('../../helpers/date');
const Event = require('../../models/event');
const Admin = require('../../models/admin');
const { transformEvent } = require('./merge.resolver');


module.exports = {
    events: async() => {
        try {
            const events = await Event.find()
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            throw err;
        };
    },
    createEvent: async(args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated');
        }
        const event = new Event({
            title: args.eventInput.title,
            date: dateToString(args.eventInput.date),
            description: args.eventInput.description,
            image: args.eventInput.image,
            creator: req.adminId
        });
        let createdEvent;
        try {
            const result = await event.save();
            createdEvent = transformEvent(result);
            const creator = await Admin.findById(req.adminId);
            console.log(result);

            if (!creator) {
                throw new Error('User not found');
            }
            creator.createdEvents.push(event);
            await creator.save();
            return createdEvent;
        } catch (err) {
            console.log(err)
            throw err;
        };
    },
};