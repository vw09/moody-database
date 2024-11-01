import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js'; 
import routeIndex from './routes/index.js';


dotenv.config();


console.log('MongoDB URI:', process.env.MONGODB_URI);

const app = express(); 

app.use(express.json());
app.use('/', routeIndex);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB", err));
