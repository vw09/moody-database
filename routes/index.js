import express from 'express';
import users from './users.js';
import Mood from '../models/Mood.js';




const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello from the INDEX!' });
});

router.use('/users', users);
router.use('/moods', Mood);

export default router;