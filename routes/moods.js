import express from 'express';
import mongoose from 'mongoose';
import Mood from '../models/Mood.js';
import Playlist from '../models/Playlist.js';
import User from '../models/User.js';

const router = express.Router();

// POST: Sla een nieuwe mood op
router.post('/', async (req, res) => {
  const { user, mood, description } = req.body;

  if (!user || !mood || !description) {
    return res.status(400).json({ message: 'User, mood, and description are required' });
  }

  try {
    const userId = mongoose.Types.ObjectId(user); // Converteer user naar ObjectId

    // Zoek een aanbevolen playlist op basis van de mood
    const recommendedPlaylist = await Playlist.findOne({ mood });
    const recommendedSong = recommendedPlaylist?.songs?.[0] || null;

    // Maak een nieuw mood-object aan
    const newMood = new Mood({
      user: userId,
      mood,
      description,
      recommendedPlaylist: recommendedPlaylist?._id || null,
      recommendedSong,
    });

    // Sla de mood op
    const savedMood = await newMood.save();

    // Voeg de mood toe aan de gebruiker
    await User.findByIdAndUpdate(userId, {
      $push: { moodHistory: savedMood._id },
    });

    res.status(201).json({
      message: 'Mood saved successfully',
      mood: savedMood,
    });
  } catch (error) {
    console.error('Error saving mood:', error);
    res.status(500).json({ message: 'Error saving mood', error });
  }
});

export default router;