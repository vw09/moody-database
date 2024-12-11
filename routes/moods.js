import express from 'express';
import Mood from '../models/Mood.js';
import Playlist from '../models/Playlist.js';

const router = express.Router();

// GET - Fetch all moods
router.get('/', async (req, res) => {
    try {
        const moods = await Mood.find().populate('recommendedPlaylist');
        res.status(200).json(moods);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching moods', error });
    }
});

// POST - Add a new mood
import User from '../models/User.js';

router.post('/', async (req, res) => {
    const { user, mood, description } = req.body;

    if (!user || !mood || !description) {
        return res.status(400).json({ message: 'User, mood, and description are required' });
    }

    try {
        const recommendedPlaylist = await Playlist.findOne({ mood });
        if (!recommendedPlaylist) {
            return res.status(404).json({ message: `No playlist found for mood: ${mood}` });
        }

        const recommendedSong = recommendedPlaylist.songs.length > 0 
            ? recommendedPlaylist.songs[0].title 
            : 'No songs available';

        const newMood = new Mood({
            user,
            mood,
            description,
            recommendedPlaylist: recommendedPlaylist._id,
            recommendedSong,
        });

        const savedMood = await newMood.save();

        // Update the user's mood history
        await User.findByIdAndUpdate(user, { $push: { moodhistory: savedMood._id } });

        res.status(201).json(savedMood);
    } catch (error) {
        res.status(400).json({ message: 'Error adding mood', error });
    }
});


router.get('/history/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const moodHistory = await Mood.find({ user: userId })
            .populate('recommendedPlaylist') // Include playlist details
            .sort({ date: -1 }); // Sort by most recent

        res.status(200).json(moodHistory);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching mood history', error });
    }
});


// Additional Routes can be added here

export default router;
