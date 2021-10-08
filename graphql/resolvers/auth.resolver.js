const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
    createUser: async(args, input) => {
        input.roles = ["guest"]; // assign guest role to new user by default
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })
            if (existingUser) {
                throw new Error('User exists already.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

            const user = new User({
                name: args.userInput.name,
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();

            console.log(result);
            return {...result._doc, password: null, id: result.id };
        } catch (err) {
            console.log(err);
            throw err;
        };
    },
    userLogin: async({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('Email and password is incorrect');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password and email is incorrect');
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecrettokenkey', {
            expiresIn: '1h'
        });
        return { userId: user.id, token: token, tokenExpiration: 1 };
    },
    updateUser: async(req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        const updateUser = await User.findByIdAndUpdate(req.id, req, function(err, res) {
            if (err) {
                console.log(err);
            }
            if (res) {
                return { name: res.name, email: res.email, password: res.password };
            } else {
                return { name: "", email: "" };
            }
        });
        const result = await updateUser.save();
        console.log(result);
    },
    updateUserAdmin: async(req) => {
        const adminRole = ["admin"];
        const myid = req.isAuth._id;
        return User.findOne({ _id: myid }, function(err, docs) {
            if (err) {
                console.log(err);
            } else {
                if (_.intersectionWith(docs.roles, adminRole, _.isEqual).length >= 1) {
                    User.findByIdAndUpdate(req.id, req, function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        return result;
                    });
                } else {
                    throw new Error("You do not have an admin role")
                }
            }
        });
    }
};