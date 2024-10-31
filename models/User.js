import e from 'express';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    moodhistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Mood', }],
    playlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', }],
    likedSongs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song', }],
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

export default User;