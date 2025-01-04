import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String },
    genre: { type: String },
    mood: { type: String, enum: ['angry', 'upset', 'sad', 'good', 'happy', 'spectacular'], required: true },
    duration: { type: Number }, // Duration in seconds (optional)
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);

export default Song;