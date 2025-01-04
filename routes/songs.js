import express from 'express';
import Song from '../models/Song.js';

const router = express.Router();

// GET all songs
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find();
        res.status(200).json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching songs', error });
    }
});

// GET multiple songs by IDs
router.get('/songs', async (req, res) => {
    const { ids } = req.query;  // Verkrijg de song IDs uit de queryparameter
    const songIds = ids.split(',');  // Zet de lijst om naar een array van ObjectIds

    try {
        const songs = await Song.find({ '_id': { $in: songIds } });  // Zoek songs op basis van de opgegeven songIds
        res.status(200).json(songs);  // Stuur de gevonden songs terug naar de frontend
    } catch (error) {
        res.status(500).json({ message: 'Error fetching songs', error });
    }
});

// POST a new song
router.post('/', async (req, res) => {
    const songData = req.body;
    try {
        const newSong = new Song(songData);
        const savedSong = await newSong.save();
        res.status(201).json(savedSong);
    } catch (error) {
        res.status(400).json({ message: 'Error adding song', error });
    }
});

// DELETE a song by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedSong = await Song.findByIdAndDelete(req.params.id);
        if (!deletedSong) return res.status(404).json({ message: 'Song not found' });
        res.status(200).json({ message: 'Song deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting song', error });
    }
});

export default router;