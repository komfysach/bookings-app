const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const Patron = require('../../models/patron');
const jwt = require('jsonwebtoken');

module.exports = {
    createAdmin: async(args) => {
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
            return {...result._doc, password: null, id: result.id };
        } catch (err) {
            console.log(err);
            throw err;
        };
    },
    createPatron: async(args) => {
        try {
            const existingPatron = await Patron.findOne({ email: args.patronInput.email })
            if (existingPatron) {
                throw new Error('User already exists');
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
    adminLogin: async({ email, password }) => {
        const admin = await Admin.findOne({ email: email });
        if (!admin) {
            throw new Error('Email and password is incorrect');
        }
        const isEqual = await bcrypt.compare(password, admin.password);
        if (!isEqual) {
            throw new Error('Password and email is incorrect');
        }
        const token = jwt.sign({ adminId: admin.id, email: admin.email }, 'somesupersecrettokenkey', {
            expiresIn: '1h'
        });
        return { adminId: admin.id, token: token, tokenExpiration: 1 };
    },
    patronLogin: async({ email, password }) => {
        const patron = await Patron.findOne({ email: email });
        if (!patron) {
            throw new Error('Email and password is incorrect');
        }
        const isEqual = await bcrypt.compare(password, patron.password);
        if (!isEqual) {
            throw new Error('Password and email is incorrect');
        }
        const token = jwt.sign({ patronId: patron.id, email: patron.email }, 'somesupersecrettokenkey')
    }
};