import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mood: { type: String, required: true, enum: ['happy', 'sad', 'angry', 'spectacular', 'good', 'upset'] },
    description: { type: String, required: true },
    recommendedPlaylist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
    recommendedSong: { type: String },
    date: { type: Date, default: Date.now },
}, { timestamps: true });

const Mood = mongoose.model('Mood', moodSchema);

export default Mood;