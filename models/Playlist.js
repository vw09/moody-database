import mongoose from 'mongoose';

const playlistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mood: { 
        type: String, 
        required: true,
        enum: ['happy', 'sad', 'angry', 'spectacular', 'good', 'upset'],  // Kleine letters voor de mood
    },
    songIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
});

const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;