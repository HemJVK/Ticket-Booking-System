import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import initDb from './dal/initDb';
import showRoutes from './routes/showRoutes';
import bookingRoutes from './routes/bookingRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/', (req, res) => {
  res.send('Ticket Booking API is running');
});

// Initialize DB and start server
initDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
