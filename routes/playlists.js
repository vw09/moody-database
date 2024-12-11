import express from 'express';
import Playlist from '../models/Playlist.js';

const router = express.Router();

// Existing routes for playlists...
// GET - Fetch all playlists
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find();
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlists', error });
    }
});

// POST - Add a new playlist
router.post('/', async (req, res) => {
    const { name, mood, songIds } = req.body;
    try {
        const newPlaylist = new Playlist({ name, mood, songIds });
        const savedPlaylist = await newPlaylist.save();
        res.status(201).json(savedPlaylist);
    } catch (error) {
        res.status(400).json({ message: 'Error adding playlist', error });
    }
});

// NEW ROUTE - Fetch a playlist by mood
router.get('/playlist/:mood', async (req, res) => {
    const { mood } = req.params;

    try {
        const playlist = await Playlist.findOne({ mood });
        if (!playlist) {
            return res.status(404).json({ message: `No playlist found for mood: ${mood}` });
        }
        res.status(200).json(playlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlist for mood', error });
    }
});

export default router;
