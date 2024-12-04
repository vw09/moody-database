import express from 'express';
import Song from '../models/Song.js';

const router = express.Router();

// GET - Haal alle songs op
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find(); // Haal alle songs op uit de database
        res.status(200).json(songs); // Stuur de songs terug als JSON
    } catch (error) {
        res.status(500).json({ message: 'Fout bij het ophalen van songs', error });
    }
});

// POST - Voeg een nieuwe song of meerdere songs toe
router.post('/', async (req, res) => {
    const songsData = req.body; // Haal de body van de request op (moet een array van songs zijn)

    try {
        // Controleer of de input een array is (meerdere songs)
        if (Array.isArray(songsData)) {
            // Voeg meerdere songs toe met insertMany()
            const savedSongs = await Song.insertMany(songsData);
            res.status(201).json(savedSongs); // Stuur de opgeslagen songs terug als JSON
        } else {
            // Voeg een enkele song toe met de save() methode
            const newSong = new Song(songsData);
            const savedSong = await newSong.save();
            res.status(201).json(savedSong); // Stuur de opgeslagen song terug als JSON
        }
    } catch (error) {
        res.status(400).json({ message: 'Fout bij het toevoegen van een song(s)', error });
    }
});

// Je kunt meer routes toevoegen voor PUT, DELETE zoals nodig

export default router;
