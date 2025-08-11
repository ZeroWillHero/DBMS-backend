const express = require('express');
const cors = require('cors');
const connectDB = require('./database/connection');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user.routes');
const parentRoutes = require('./routes/parent/parent.routes');

const app = express();

const allowedOrigins = [
  'https://arduinonight.com',
  'https://www.arduinonight.com',
  'https://arduinonight.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'https://v0-admin-panel-development-af729zgp1-zerowillheros-projects.vercel.app',
  'https://v0-admin-panel-development-gamma.vercel.app',
  'https://dbms-backend-3g2f.onrender.com',
  'https://www.dbms-backend-3g2f.onrender.com',
  'https://www.ictevent.net',
];
// connect to the Database
connectDB();
// use cors for cross-origin requests
app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS request from:', origin);
    // allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Increase payload size limits here:
app.use(express.json({ limit: '50mb' })); // or higher if needed
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Register the admin user if not already registered
const RegisterAdmin = require('./routes/controllers/registerAdmin');
RegisterAdmin();

// routes 
app.use('/api/users', userRoutes);
app.use('/api/parents', parentRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    }
);