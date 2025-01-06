import express from 'express';
import mongoose from 'mongoose';
import Mood from '../models/Mood.js';
import User from '../models/User.js';

const router = express.Router();

// POST: Sla een nieuwe mood op
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { mood, description } = req.body;

  if (!mood || !description) {
    return res.status(400).json({ message: 'Mood and description are required' });
  }

  try {
    const userIdObject = mongoose.Types.ObjectId(userId); // Zorg ervoor dat userId een ObjectId is

    // Maak een nieuw mood-object aan
    const newMood = new Mood({
      user: userIdObject,
      mood,
      description,
    });

    // Sla de mood op
    const savedMood = await newMood.save();

    // Voeg de mood toe aan de gebruiker
    await User.findByIdAndUpdate(userIdObject, {
      $push: { moodHistory: savedMood._id },
    });

    res.status(200).json({
      message: 'Mood saved successfully',
      mood: savedMood,
    });
  } catch (error) {
    console.error('Error saving mood:', error);
    res.status(500).json({ message: 'Error saving mood', error });
  }
});

export default router;