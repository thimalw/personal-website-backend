const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const User = require('../models/User');
const logger = require('../services/logger');
const validUser = require('../models/validation/User');
const { makeRes, to } = require('../helpers');

const create = async (user) => {
    // validate input
    const validatedUser = Joi.validate(user, validUser, {
        allowUnknown: false,
        abortEarly: false
    });

    if (validatedUser.error !== null) {
        return makeRes(400, 'Unable to register new user.', { errors: validatedUser.error.details });
    }

    // save user to database
    let err, savedUser;
    const userInstance = new User(validatedUser.value);
    [err, savedUser] = await to(userInstance.save());

    if (err) {
        logger.error(err);
        return makeRes(err.status, 'Unable to register new user.');
    }

    return makeRes(200, 'User registered.', {
        user: {
            _id: savedUser._id,
            email: savedUser.email
        }
    });
};

const read = async (id) => {
    let err, user;
    [err, user] = await to(User.findById(id));

    if (err) {
        logger.error(err);
        return makeRes(err.status, 'Unable to retrieve user');
    }

    if (user) {
        user.password = undefined;
        return makeRes(200, 'User retrieved', { user });
    }

    return makeRes(404, 'User not found');
};

const authenticate = async ({ email, password }) => {
    let err, userInfo;
    [err, userInfo] = await to(User.findOne({ email }));

    if (err) {
        logger.error(err);
        return makeRes(err.status, 'Unable to authenticate.');
    }

    if (userInfo && bcrypt.compareSync(password, userInfo.password)) {
        const secret = process.env.JWT_SECRET;
        const opts = {
            expiresIn: 86400 // 24 hours
        };

        const token = jwt.sign({ id: userInfo._id, key: userInfo.key, salt: userInfo.salt }, secret, opts);

        return makeRes(200, 'Authentication successful.', { token });
    }

    return makeRes(401, 'Invalid credentials.');
};

module.exports = {
    create,
    read,
    authenticate
};
