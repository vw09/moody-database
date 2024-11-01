import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song', }],
    mood: { type: String, required: true },
});


const Playlist = mongoose.model('Playlist', playlistSchema);

export default Playlist;