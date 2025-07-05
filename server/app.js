import express from 'express';
import cors from 'cors';
import roomRoutes from './routes/roomRoutes.js';

const app = express();

// using json parsing because duh
app.use(express.json());
app.use(cors());

// basic test route
app.get('/', (req, res) => {
  res.send('api is up, chill');
});

// room api routes
app.use('/api/rooms', roomRoutes);

export default app;
