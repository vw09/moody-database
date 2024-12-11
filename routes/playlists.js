import express from 'express';
import Playlist from '../models/Playlist.js';

const router = express.Router();

// Middleware to parse JSON (Ensure this is set in your main server file as well)
router.use(express.json());

// GET - Retrieve all playlists
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find();
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving playlists', error });
    }
});

// POST - Add a new playlist
router.post('/', async (req, res) => {
    console.log('Request Body:', req.body); // Log the request body for debugging

    const { name, mood, songIds } = req.body;

    // Validate required fields
    if (!name || !mood || !Array.isArray(songIds)) {
        return res.status(400).json({
            message: 'Missing required fields: name, mood, or songIds',
        });
    }

    try {
        const newPlaylist = new Playlist({ name, mood, songIds });
        const savedPlaylist = await newPlaylist.save();
        res.status(201).json(savedPlaylist);
    } catch (error) {
        console.error('Error saving playlist:', error); // Detailed error logging
        res.status(400).json({ message: 'Error adding playlist', error });
    }
});

export default router;
