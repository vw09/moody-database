import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';
import routeIndex from './routes/index.js';

// Laad de omgevingsvariabelen vanuit het .env-bestand
dotenv.config();

// Log de MONGODB_URI naar de console
console.log('MongoDB URI:', process.env.MONGODB_URI);

const app = express(); 

app.use(express.json());

app.use('/', routeIndex);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Maak verbinding met MongoDB
mongoose.connect(process.env.MONGODB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const db = mongoose.connection;

db.on('error', (error) => console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
