import express from 'express';
import Playlist from '../models/Playlist.js';

const router = express.Router();

// GET - Haal alle playlist op
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find();
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Fout bij het ophalen van moods', error });
    }
});

// POST - Voeg een nieuwe playlist toe
router.post('/', async (req, res) => {
    const playlists = new playlists(req.body);
    try {
        const newPlaylist = await playlists.save();
        res.status(201).json(newPlaylist);
    } catch (error) {
        res.status(400).json({ message: 'Fout bij het toevoegen van mood', error });
    }
});

// Je kunt meer routes toevoegen voor GET, PUT, DELETE zoals nodig

export default router;
