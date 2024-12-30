import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// GET all messages
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().populate('sender recipients');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});

// POST a new message
router.post('/', async (req, res) => {
    const { text, sender, recipients } = req.body;
    try {
        const newMessage = new Message({ text, sender, recipients });
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        res.status(400).json({ message: 'Error adding message', error });
    }
});

export default router;