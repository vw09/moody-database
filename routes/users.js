import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('moodhistory playlist likedSongs');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
});

// GET a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('moodhistory playlist likedSongs');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});

// GET the last mood and its playlist
router.get('/:id/last-mood', async (req, res) => {
    try {
        // Vind de gebruiker en populeer de `moodHistory` en de `playlist`
        const user = await User.findById(req.params.id)
            .populate({
                path: 'moodHistory.playlist',
                populate: { path: 'songIds' } // Populeer de songs in de playlist
            });

        if (!user || !user.moodHistory || user.moodHistory.length === 0) {
            return res.status(404).json({ message: 'No mood history found for this user' });
        }

        // Haal de laatste stemming op
        const lastMood = user.moodHistory[user.moodHistory.length - 1];
        res.status(200).json(lastMood);
    } catch (error) {
        console.error('Error fetching last mood:', error);
        res.status(500).json({ message: 'Error fetching last mood', error });
    }
});

// POST a new user
router.post('/', async (req, res) => {
    const { username, email } = req.body;
    try {
        const newUser = new User({ username, email });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

// PUT to update a user
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
});

// DELETE a user
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
});

export default router;