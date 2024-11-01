// routes/index.js
import express from 'express';
import users from './users.js'; 
import moods from './moods.js'; 
import playlists from './playlists.js'; 
import songs from './songs.js'; 

const router = express.Router();

// Definieer een basisroute
router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

// Voeg de routes toe
router.use('/users', users);
router.use('/moods', moods);
router.use('/playlists', playlists);
router.use('/songs', songs);

export default router;
