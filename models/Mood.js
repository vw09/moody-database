import mongoose from "mongoose";


const moodSchema = new mongoose.Schema({
    username: { type: String, required: true },
    date: { type: Date, default: Date.now }, 
    mood: { type: String, required: true },
    description: { type: String, required: true },
    recommendedPlaylist: { type: String, required: true },
    recommendedSong: { type: String, required: true }, 
});

const Mood = mongoose.model('Mood', moodSchema); 

export default Mood; 
