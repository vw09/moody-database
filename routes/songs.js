import express from 'express';
import Song from '../models/Song.js';

const router = express.Router();


// GET random song
router.get('/random', async (req, res) => {
  try {
    const count = await Song.countDocuments(); // Tel het totale aantal songs
    const random = Math.floor(Math.random() * count); // Kies een random index
    const randomSong = await Song.findOne().skip(random); // Sla de eerste 'random' nummers over
    res.status(200).json(randomSong); // Stuur de random song terug
  } catch (error) {
    res.status(500).json({ message: 'Error fetching random song', error });
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