import express from 'express';
import users from './users.js';




const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello from the INDEX!' });
});

router.use('/users', users);

export default router;