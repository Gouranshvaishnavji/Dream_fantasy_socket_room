import app from './app.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import redisClient from './config/redisClient.js';
import roomHandler from './SocketHandlers/roomHandler.js';
import dotenv from 'dotenv';

dotenv.config();

// connect to mongo, yo
connectDB();

// setup express http server
const server = createServer(app);

// setup socket.io on top of that http server
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
  },
});

// hook up socket logic
io.on('connection', (socket) => {
  console.log('new user connected... hope we stay friendly');

  roomHandler(io, socket);
});

// make sure redis connected too
redisClient.on('connect', () => {
  console.log('redis finally connected, took him long enough');
});

redisClient.on('error', (err) => {
  console.log('dude redis messed up: ', err);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`server running on port ${PORT}, dont break stuff pls`);
});
