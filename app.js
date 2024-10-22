import express from 'express';
import dotenv from 'dotenv';
import mongoose, { mongo } from 'mongoose';
import routeIndex from './routes/index.js';

dotenv.config();

const app = express(); 

app.use(express.json());

app.use('/', routeIndex);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const db = mongoose.connection;

db.on('error', (error) => console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});