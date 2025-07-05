import redis from '../utils/redisClient.js';
import { getRoomKey, initializeRoom } from '../controllers/roomController.js';

export const registerRoomHandlers = (io, socket) => {
  socket.on('join-room', async ({ roomId, username }) => {
    socket.join(roomId);
    let roomData = await getRoomData(roomId);
    if (!roomData) {
      roomData = initializeRoom();
    }

    if (!roomData.users.find(u => u.id === socket.id)) {
      roomData.users.push({ id: socket.id, username });
    }

    await saveRoom(roomId, roomData);
    io.to(roomId).emit('room-updated', roomData);
  });

  socket.on('start-selection', async ({ roomId }) => {
    let roomData = await getRoomData(roomId);
    if (!roomData) return;

    roomData.turnOrder = [...roomData.users].sort(() => Math.random() - 0.5);
    roomData.started = true;
    roomData.currentTurnIndex = 0;

    await saveRoom(roomId, roomData);
    io.to(roomId).emit('selection-started', roomData);

    startTurn(io, roomId);
  });

  socket.on('select-player', async ({ roomId, playerName }) => {
    let roomData = await getRoomData(roomId);
    if (!roomData || !roomData.started) return;

    const currentUser = roomData.turnOrder[roomData.currentTurnIndex];
    if (currentUser.id !== socket.id) return;

    roomData.selections[socket.id] = roomData.selections[socket.id] || [];
    roomData.selections[socket.id].push(playerName);
    roomData.playersPool = roomData.playersPool.filter(p => p !== playerName);

    clearTimeout(roomData.currentTurnTimer);
    await saveRoom(roomId, roomData);

    io.to(roomId).emit('player-picked', { playerName, userId: socket.id });
    await nextTurnOrEnd(io, roomId);
  });
};

const getRoomData = async (roomId) => {
  const data = await redis.get(getRoomKey(roomId));
  return data ? JSON.parse(data) : null;
};

const saveRoom = async (roomId, data) => {
  const toSave = { ...data };
  delete toSave.currentTurnTimer;
  await redis.set(getRoomKey(roomId), JSON.stringify(toSave));
};

const startTurn = async (io, roomId) => {
  let roomData = await getRoomData(roomId);
  if (!roomData) return;

  const currentUser = roomData.turnOrder[roomData.currentTurnIndex];

  io.to(roomId).emit('turn-started', { userId: currentUser.id, username: currentUser.username });

  const timer = setTimeout(async () => {
    const autoPlayer = roomData.playersPool[0];
    roomData.selections[currentUser.id] = roomData.selections[currentUser.id] || [];
    roomData.selections[currentUser.id].push(autoPlayer);
    roomData.playersPool = roomData.playersPool.filter(p => p !== autoPlayer);

    await saveRoom(roomId, roomData);
    io.to(roomId).emit('player-auto-picked', { playerName: autoPlayer, userId: currentUser.id });

    await nextTurnOrEnd(io, roomId);
  }, 10000);

  roomData.currentTurnTimer = timer;
  await saveRoom(roomId, roomData);
};

const nextTurnOrEnd = async (io, roomId) => {
  let roomData = await getRoomData(roomId);
  if (!roomData) return;

  const allDone = roomData.turnOrder.every(u => (roomData.selections[u.id] || []).length >= 5);

  if (allDone) {
    io.to(roomId).emit('selection-ended', roomData.selections);
    await redis.del(getRoomKey(roomId));
  } else {
    roomData.currentTurnIndex = (roomData.currentTurnIndex + 1) % roomData.turnOrder.length;
    await saveRoom(roomId, roomData);
    startTurn(io, roomId);
  }
};
