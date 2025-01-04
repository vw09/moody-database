import express from 'express';
import mongoose from 'mongoose';
import Playlist from '../models/Playlist.js';

const router = express.Router();

// GET all playlists
router.get('/', async (req, res) => {
    try {
        const playlists = await Playlist.find().populate('songIds');
        res.status(200).json(playlists);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlists', error });
    }
});

// POST a new playlist
router.post('/', async (req, res) => {
    const { name, mood, songIds } = req.body;
    try {
        const newPlaylist = new Playlist({ name, mood, songIds });
        const savedPlaylist = await newPlaylist.save();
        res.status(201).json(savedPlaylist);
    } catch (error) {
        res.status(400).json({ message: 'Error creating playlist', error });
    }
});

// GET playlists by mood
router.get('/mood/:mood', async (req, res) => {
    const { mood } = req.params;
    try {
        const playlist = await Playlist.findOne({ mood }).populate('songIds');
        if (!playlist) return res.status(404).json({ message: 'Playlist not found for this mood' });
        res.status(200).json(playlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching playlist', error });
    }
});

export default router;