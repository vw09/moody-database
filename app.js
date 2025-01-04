import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import User from './models/User.js';
import moodsRoute from './routes/moods.js';
import usersRoute from './routes/users.js';
import songsRoute from './routes/songs.js';
import indexRoute from './routes/index.js';
import playlistsRoute from './routes/playlists.js';

dotenv.config();

const app = express();

app.use(express.json());

// configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://moody-database.onrender.com/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0].value;
    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        username: profile.displayName,
        email: email,
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on('error', (error)=> console.error(error));
db.once('open', ()=> console.log('Connected to Database'));

app.use('/', indexRoute);
app.use('/moods', moodsRoute);
app.use('/users', usersRoute);
app.use('/playlists', playlistsRoute);
app.use('/songs', songsRoute);

// Google Authentication Routes
app.get('/auth/google',
   passport.authenticate('google', { scope: ['profile', 'email'] })
  );


app.get('/auth/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/',
    successRedirect: '/index',
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});