import express from 'express';
const router = express.Router();


router.get('/', (req, res) => {
  res.json(messages);
});

router.post('/', (req, res) => {
    const message = req.body;
    res.status(201).json({message: 'Message added successfully!', messageData: newMessage});
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const updatedMessage = req.body;
    if (id) {
        res.json({ message: `Message updated successfully!`, messageData: updatedMessage });
    } else {
        res.json({ message: 'Message not found!' });
    }
});

router.delete('/', (req, res) => {
    const { id } = req.query;
    if (id) {
        res.json({ message: `Message deleted successfully!` });
    } else {
        res.status(404).json({ message: 'Message not found!' });
    }
});

export default router;