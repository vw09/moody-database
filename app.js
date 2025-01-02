import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import mongoStore from 'connect-mongo'; // Session store for MongoDB
import User from './models/User.js';
import moodsRoutes from './routes/moods.js';
import usersRoute from './routes/users.js';
import songsRoutes from './routes/songs.js';
import indexRoute from './routes/index.js';
import playlistsRoutes from './routes/playlists.js';

dotenv.config();

const app = express();

app.use(express.json());

// Session middleware
app.use(
  session({
    store: mongoStore.create({ mongoUrl: process.env.MONGO_URI }), // Connect sessions to MongoDB
    secret: process.env.SESSION_SECRET || 'default_secret', // Gebruik een veilige secret
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 dag in milliseconden
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/auth/google/callback`, // Dynamische callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await User.findOne({ email });

        // Maak een nieuwe gebruiker aan als deze nog niet bestaat
        if (!user) {
          user = new User({ email, username: profile.displayName });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Google Authentication Routes
app.get('/auth/google', (req, res, next) => {
  const redirectUri = req.query.redirectUri;

  if (!redirectUri) {
    return res.status(400).json({ message: 'Missing redirectUri' });
  }

  const authOptions = {
    scope: ['profile', 'email'],
    state: JSON.stringify({ redirectUri }),
  };

  passport.authenticate('google', authOptions)(req, res, next);
});

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;
    const { redirectUri } = JSON.parse(req.query.state || '{}');
    const fallbackUri = process.env.FRONTEND_URL || 'exp://localhost:3000';

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

// Other Routes
app.use('/', indexRoute); // Zet je hoofdroutes
app.use('/moods', moodsRoutes);
app.use('/playlists', playlistsRoutes);
app.use('/users', usersRoute);
app.use('/songs', songsRoutes);

// Fallback Route (404 handler)
app.all('*', (req, res) => {
  console.log('Request Path:', req.path);
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.API_URL || `http://localhost:${PORT}`}`);
});