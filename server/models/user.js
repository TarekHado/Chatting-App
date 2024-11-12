
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: [true, 'email address already taken']
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    }
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id}, process.env.JWT_PRIVATE_KEY);
    return token;
}

const User = mongoose.model('user', userSchema);

function validateUser (user) {
    const schema = Joi.object({
        name: Joi.string()
            .alphanum()
            .min(3)
            .max(50)
            .required(),

        password: Joi.string()
            .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().min(8).max(1024),

        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org'] } })
            .required().min(5).max(255)
    });

    return schema.validate(user);
}

module.exports.validate = validateUser;
module.exports.User = User;
