import mongoose from "mongoose";

const moodEntrySchema = new mongoose.Schema({
    username: { type: String, required: true },
    Date: { type: Date, default: Date.now },
    mood: { type: String, required: true },
    description: { type: String, required: true },
    recommendedPlaylist: { type: String, required: true },
    recommendedsong: { type: String, required: true },
});


export default moodEntry;