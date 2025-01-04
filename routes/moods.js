import express from 'express';
import mongoose from 'mongoose';
import Mood from '../models/Mood.js';

const router = express.Router();


// POST route voor het opslaan van een nieuwe stemming
router.post('/', async (req, res) => {
    const { user, mood, description } = req.body;

    if (!user || !mood || !description) {
        return res.status(400).json({ message: 'User, mood, and description are required' });
    }

    try {
        // Zorg ervoor dat we hier alleen het ObjectId van de gebruiker gebruiken
        const userId = mongoose.Types.ObjectId(user._id); // Gebruik alleen het ObjectId van de gebruiker

        // Zoek de playlist op basis van de mood
        const recommendedPlaylist = await Playlist.findOne({ mood: mood.toLowerCase() });
        if (!recommendedPlaylist) {
            return res.status(404).json({ message: `No playlist found for mood: ${mood}` });
        }

        const recommendedSong = recommendedPlaylist.songIds.length > 0
            ? recommendedPlaylist.songIds[0]  // Pak de eerste song uit de playlist
            : null;

        // Maak een nieuw Mood document aan
        const newMood = new Mood({
            user: userId, // Het ObjectId van de gebruiker
            mood: mood.toLowerCase(),
            description,
            recommendedPlaylist: recommendedPlaylist._id, // Het ObjectId van de playlist
            recommendedSong,
        });

        const savedMood = await newMood.save(); // Sla de stemming op in de database

        // Update de moodHistory van de gebruiker met de nieuwe stemming
        await User.findByIdAndUpdate(userId, { $push: { moodHistory: savedMood._id } });

        res.status(201).json({
            message: 'Mood saved successfully',
            mood: savedMood,
            playlist: recommendedPlaylist,
        });
    } catch (error) {
        console.error('Error saving mood:', error);
        res.status(500).json({ message: 'Error saving mood', error });
    }
});

export default router;