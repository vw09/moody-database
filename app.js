import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import User from './models/User.js';
import routeIndex from './routes/index.js';
import moodsRoutes from './routes/moods.js';
import playlistsRoutes from './routes/playlists.js';
import songsRoutes from './routes/songs.js';
import mongoStore from 'connect-mongo'; // Session store for MongoDB

dotenv.config();

const app = express();

console.log('MongoDB URI:', process.env.MONGO_URI);

app.use(express.json());

// Configure session middleware
app.use(
  session({
    store: mongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Connect sessions to MongoDB
    secret: process.env.SESSION_SECRET || 'mySecretKey',
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
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://moody-database.onrender.com/auth/google/callback', 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        // Create a new user if one doesn't exist
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
    }
  )
);

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

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Routes
app.use('/', routeIndex);
app.use('/moods', moodsRoutes);
app.use('/playlists', playlistsRoutes);
app.use('/songs', songsRoutes);

// Google Authentication Routes
app.get('/auth/google', (req, res, next) => {
  const redirectUri = req.query.redirectUri;

  const authOptions = {
    scope: ['profile', 'email'],
    state: JSON.stringify({ redirectUri }), // Encode redirectUri in state
  };

  passport.authenticate('google', authOptions)(req, res, next);
});

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;
    const { redirectUri } = JSON.parse(req.query.state); // Retrieve redirectUri from state
    const fallbackUri = 'exp://localhost:3000'; // Update for your Expo app

    const userInfo = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const redirectUrl = `${redirectUri || fallbackUri}?user=${encodeURIComponent(
      JSON.stringify(userInfo)
    )}`;
    res.redirect(redirectUrl);
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
