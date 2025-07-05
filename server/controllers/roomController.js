import Room from '../models/Room.js';
import { getAllPlayers } from '../utils/playerPool.js';

// create room
export const createRoom = async (req, res) => {
  try {
    const { roomId, host } = req.body;

    const room = new Room({
      roomId,
      host,
      players: [],
      availablePlayers: getAllPlayers(),
      turnOrder: [],
      currentTurn: 0,
    });

    await room.save();
    res.status(201).json(room);
  } catch (error) {
    console.log('dude error creating room: ', error);
    res.status(500).json({ error: 'could not create room' });
  }
};

// get room
export const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId });
    if (!room) {
      return res.status(404).json({ error: 'room not found' });
    }
    res.json(room);
  } catch (error) {
    console.log('error fetching room: ', error);
    res.status(500).json({ error: 'could not fetch room' });
  }
};
