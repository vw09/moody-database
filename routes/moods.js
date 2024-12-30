import express from 'express';
import Mood from '../models/Mood.js';
import Playlist from '../models/Playlist.js';
import User from '../models/User.js';

const router = express.Router();

// GET all moods
router.get('/', async (req, res) => {
    try {
        const moods = await Mood.find().populate('recommendedPlaylist');
        res.status(200).json(moods);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching moods', error });
    }
});

// POST a new mood
router.post('/', async (req, res) => {
    const { user, mood, description } = req.body;
    try {
        const recommendedPlaylist = await Playlist.findOne({ mood });
        const newMood = new Mood({
            user,
            mood,
            description,
            recommendedPlaylist: recommendedPlaylist?._id || null,
            recommendedSong: recommendedPlaylist?.songIds?.[0] || null,
        });
        const savedMood = await newMood.save();
        await User.findByIdAndUpdate(user, { $push: { moodhistory: savedMood._id } });
        res.status(201).json(savedMood);
    } catch (error) {
        res.status(400).json({ message: 'Error saving mood', error });
    }
});

// Additional routes can follow the same structure
export default router;