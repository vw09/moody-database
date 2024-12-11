import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'], // Add custom error message
    },
    mood: {
        type: String,
        required: [true, 'Mood is required'], // Add custom error message
    },
    songIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',  // Reference to the Song collection
        required: true, // Required field
    }]
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

export default Playlist;
