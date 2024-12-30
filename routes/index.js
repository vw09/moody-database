import express from 'express';
import users from './users.js';
import moods from './moods.js';
import playlists from './playlists.js';
import songs from './songs.js';
import messages from './messages.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the API!' });
});

router.use('/users', users);
router.use('/moods', moods);
router.use('/playlists', playlists);
router.use('/songs', songs);
router.use('/messages', messages);

// Fallback route for 404 errors
router.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

export default router;