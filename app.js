import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import mongoStore from 'connect-mongo'; // Session store for MongoDB
import User from './models/User.js';
import moodsRoute from './routes/moods.js';
import usersRoute from './routes/users.js';
import songsRoute from './routes/songs.js';
import indexRoute from './routes/index.js';
import playlistsRoute from './routes/playlists.js';

dotenv.config();

const app = express();

console.log('MongoDB URI:', process.env.MONGO_URI);

app.use(express.json());

// Configure session middleware
app.use(
  session({
    store: mongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Connect sessions to MongoDB
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
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
app.get('/auth/google', (req, res, next) => {
  const redirectUri = req.query.redirectUri;

  const authOptions = {
    scope: ['profile', 'email'],
    state: JSON.stringify({ redirectUri }) // Encode redirectUri in state
  };

  passport.authenticate('google', authOptions)(req, res, next);
});

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;
    const { redirectUri } = JSON.parse(req.query.state);
    const fallbackUri = 'exp://localhost:3000'; // Update for your Expo app

    const userInfo = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const redirectUrl = `${redirectUri || fallbackUri}?user=${encodeURIComponent(JSON.stringify(userInfo))}`;
    res.redirect(redirectUrl);
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});