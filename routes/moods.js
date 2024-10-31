import express from 'express';
import Mood from '../models/Mood.js';

const router = express.Router();

// GET - Haal alle moods op
router.get('/', async (req, res) => {
    try {
        const moods = await Mood.find();
        res.status(200).json(moods);
    } catch (error) {
        res.status(500).json({ message: 'Fout bij het ophalen van moods', error });
    }
});

// POST - Voeg een nieuwe mood toe
router.post('/', async (req, res) => {
    const mood = new Mood(req.body);
    try {
        const newMood = await mood.save();
        res.status(201).json(newMood);
    } catch (error) {
        res.status(400).json({ message: 'Fout bij het toevoegen van mood', error });
    }
});

// Je kunt meer routes toevoegen voor GET, PUT, DELETE zoals nodig

export default router;
