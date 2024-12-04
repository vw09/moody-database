import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Dit veld is verplicht
    },
    mood: {
        type: String,
        required: true, // Dit veld is verplicht
    },
    songIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',  // Verwijst naar de Song collectie
        required: true, // Dit veld is verplicht
    }]
});

const Playlist = mongoose.model('Playlist', PlaylistSchema);

export default Playlist;
