import express from 'express';
import Playlist from '../models/Playlist.js';
import Song from '../models/Song.js';

const router = express.Router();

// GET - Haal alle afspeellijsten op
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find();
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Fout bij het ophalen van afspeellijsten', error });
    }
});

// POST - Voeg een nieuwe afspeellijst toe
router.post('/', async (req, res) => {
    console.log('Request Body:', req.body);  // Log de request body
    const { name, mood, songIds } = req.body;
    try {
        const newPlaylist = new Playlist({ name, mood, songIds });
        const savedPlaylist = await newPlaylist.save();
        res.status(201).json(savedPlaylist);
    } catch (error) {
        console.log('Error:', error);  // Log de fout om te zien waar het misgaat
        res.status(400).json({ message: 'Fout bij het toevoegen van een afspeellijst', error });
    }
});


// Je kunt meer routes toevoegen voor GET, PUT, DELETE zoals nodig

export default router;
