import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  host: { type: String, required: true },
  players: [{ username: String, selectedPlayers: [String] }],
  availablePlayers: [String],
  turnOrder: [String],
  currentTurn: Number,
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
