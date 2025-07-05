import Room from '../models/Room.js';
import { getAllPlayers } from '../utils/playerPool.js';
import redisClient from '../config/redisClient.js';

// handle socket events
const roomHandler = (io, socket) => {
  socket.on('join-room', async ({ roomId, username }) => {
    console.log(`new dude tryna join room ${roomId} as ${username}`);

    socket.join(roomId);

    const room = await Room.findOne({ roomId });
    if (!room) {
      console.log('room not found... awkward');
      return;
    }

    room.players.push({ username, selectedPlayers: [] });
    await room.save();

    io.to(roomId).emit('player-joined', { username });
  });

  socket.on('start-selection', async ({ roomId }) => {
    console.log('host started the draft, no going back now');

    const room = await Room.findOne({ roomId });
    if (!room) return;

    const shuffled = room.players.map(p => p.username).sort(() => Math.random() - 0.5);
    room.turnOrder = shuffled;
    room.currentTurn = 0;
    await room.save();

    await redisClient.set(`room:${roomId}`, JSON.stringify(room));

    io.to(roomId).emit('selection-started', { order: shuffled });
  });

  socket.on('select-player', async ({ roomId, username, player }) => {
    console.log(`${username} picked ${player}... hope it was good`);

    const room = await Room.findOne({ roomId });
    if (!room) return;

    if (!room.availablePlayers.includes(player)) {
      console.log('dude picked a ghost player, wtf');
      return;
    }

    const playerObj = room.players.find(p => p.username === username);
    if (!playerObj) return;

    playerObj.selectedPlayers.push(player);

    // remove from available
    room.availablePlayers = room.availablePlayers.filter(p => p !== player);

    // move to next turn
    room.currentTurn = (room.currentTurn + 1) % room.turnOrder.length;

    await room.save();
    await redisClient.set(`room:${roomId}`, JSON.stringify(room));

    io.to(roomId).emit('player-selected', {
      username,
      player,
      nextTurn: room.turnOrder[room.currentTurn],
    });

    // if all done
    const everyoneDone = room.players.every(p => p.selectedPlayers.length >= 5);
    if (everyoneDone) {
      io.to(roomId).emit('selection-ended', { final: room.players });
      console.log('all done gamblers, good luck with these squads');
    }
  });
};

export default roomHandler;
