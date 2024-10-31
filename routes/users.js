import express from 'express';
import User from '../models/User.js';

const router = express.Router();


// GET - Haal alle gebruikers op
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('moodhistory playlist likedSongs');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Fout bij het ophalen van gebruikers', error });
    }
});

// GET - Haal één gebruiker op met ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('moodhistory playlist likedSongs');
        if (!user) {
            return res.status(404).json({ message: 'Gebruiker niet gevonden' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Fout bij het ophalen van gebruiker', error });
    }
});

// POST - Voeg een nieuwe gebruiker toe
router.post('/', async (req, res) => {
    const { username, email } = req.body;
    const user = new User({ username, email });
    
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: 'Fout bij het aanmaken van gebruiker', error });
    }
});

// PUT - Werk een gebruiker bij
router.put('/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Gebruiker niet gevonden' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Fout bij het bijwerken van gebruiker', error });
    }
});

// DELETE - Verwijder een gebruiker
router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Gebruiker niet gevonden' });
        }
        res.status(200).json({ message: 'Gebruiker verwijderd' });
    } catch (error) {
        res.status(500).json({ message: 'Fout bij het verwijderen van gebruiker', error });
    }
});

export default router;
