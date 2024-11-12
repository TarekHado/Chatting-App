
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const { User, validate } = require('../models/user');

const getUsers = async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user._id } }).sort('createdAt').select(['-_id', '-password', '-timestamps']);
    res.status(200).send(users);
};

const register = async (req, res) => {
    const { error } = validate(req.body);
    if (error) res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) res.status(400).send('User Already Registered');

    user = new User(_.pick(req.body, ['_id', 'name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();
    const token = user.generateAuthToken();
    return res.header('x-auth-token', token).status(200).send(_.pick(user, ['_id', 'name', 'email']));
};

const login =  async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) res.status(400).send('All fields are mandatory');
    let user = await User.findOne({email});
    if (!user) return res.status(400).send('Invalid email');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid password');
    
    const token = user.generateAuthToken();
    return res.send(token);
}

const profile = async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    return res.status(200).send(user);
};

let blackListedTokens = [];

const logout = async (req, res) => {
    blackListedTokens.push(req.header('x-auth-token'));
    console.log(blackListedTokens);
    res.status(403).send('Logged Out');
    blackListedTokens = [];
    console.log(blackListedTokens);
}

module.exports = { getUsers, register, login, profile, logout, blackListedTokens};
