
const mongoose = require('mongoose');

module.exports = async function () {
    const connect = await mongoose.connect(process.env.DB);
    console.log(`Connected to ${connect.connection.name}`);
}