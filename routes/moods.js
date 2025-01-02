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

    if (!user || !mood || !description) {
        return res.status(400).json({ message: 'User, mood, and description are required' });
    }

    try {
        const recommendedPlaylist = await Playlist.findOne({ mood: mood.toLowerCase() });  // Zet de mood naar kleine letters voordat je zoekt
        if (!recommendedPlaylist) {
            return res.status(404).json({ message: `No playlist found for mood: ${mood}` });
        }

        const recommendedSong = recommendedPlaylist.songIds.length > 0
            ? recommendedPlaylist.songIds[0] // Pak de eerste song ID
            : null;

        const newMood = new Mood({
            user,
            mood: mood.toLowerCase(), // Zorg ervoor dat de mood in kleine letters is
            description,
            recommendedPlaylist: recommendedPlaylist._id,
            recommendedSong,
        });

        const savedMood = await newMood.save();
        await User.findByIdAndUpdate(user, { $push: { moodhistory: savedMood._id } });

        res.status(201).json({
            message: 'Mood saved successfully',
            mood: savedMood,
            playlist: recommendedPlaylist,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error saving mood', error });
    }
});

// Additional routes can follow the same structure
export default router;