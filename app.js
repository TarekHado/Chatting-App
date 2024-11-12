
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('express-async-errors');
const users = require('./server/routes/users');
const messages = require('./server/routes/messages');
const Message = require('./server/models/message');
const expressLayouts = require('express-ejs-layouts');
const db = require('./server/config/db');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Database connection
db();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true }));
// app.use(express.static('public'));
app.use(expressLayouts);
// app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Listen for new message from clients
    socket.on('newMessage', async (data) => {
        const { sender, receiver, content } = data;

        try {
            // Save the message to the database
            const newMessage = new Message({
                sender,
                receiver,
                content
            });
            await newMessage.save();

            // Emit the message to the receiver's socket (private message)
            io.to(receiver).emit('chatMessage', data);  // Emit only to the receiver

        } catch (err) {
            console.log('Error saving message:', err);
        }
    });

    // Listen for users joining a specific "room" (receiver identifier)
    socket.on('joinRoom', (receiver) => {
        socket.join(receiver);  // Join a room named after the receiver
        console.log(`${receiver} joined the room`);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Routes
app.use('/api/messages', messages);
app.use('/api/users', users);

// Start the server
const port = process.env.PORT || 5500;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
