
const Message = require('../models/message');

const getMessages = async (req, res) => {
    try {
        const messages = await Message.find({sender: req.user._id}).select(['-_id', 'reciever']) && await Message.find({receiver: req.user._id}).select(['-_id', 'receiver']);
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
}

const createMessage = async (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        const messages = await Message.find({sender: req.user._id}).select(['-_id', 'reciever']) && await Message.find({receiver: req.user._id}).select(['-_id', 'receiver']);
        const newMessage = new Message({
            sender: req.user._id,
            receiver: req.params.id,
            content
        });
        // await newMessage.save();
        // res.status(200).send(newMessage);
        res.render('chat', {
            messages,
            newMessage,
            layout: '../views/chat'
        });
    } catch (err) {
        res.status(500).json({ message: 'Error saving message' });
    }
};

module.exports = { getMessages, createMessage };