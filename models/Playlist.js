import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mood: { type: String, required: true },
    songIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song', required: true }],
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;