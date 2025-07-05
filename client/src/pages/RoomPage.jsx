import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './RoomPage.css';

const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000");

const RoomPage = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [joined, setJoined] = useState(false);
  const [roomData, setRoomData] = useState({});
  const [currentTurn, setCurrentTurn] = useState({});
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [mySocketId, setMySocketId] = useState('');

  useEffect(() => {
    setMySocketId(socket.id);
  }, []);

  useEffect(() => {
    socket.on('room-updated', (data) => {
      setRoomData(data);
      setAvailablePlayers(data.playersPool || []);
    });

    socket.on('selection-started', (data) => {
      setRoomData(data);
      setAvailablePlayers(data.playersPool || []);
    });

    socket.on('turn-started', ({ userId, username }) => {
      setCurrentTurn({ userId, username });
    });

    socket.on('player-picked', ({ playerName }) => {
      setAvailablePlayers(prev => prev.filter(p => p !== playerName));
    });

    socket.on('player-auto-picked', ({ playerName }) => {
      setAvailablePlayers(prev => prev.filter(p => p !== playerName));
    });

    socket.on('selection-ended', (selections) => {
      alert("Selection ended! Check console for final teams.");
      console.log("Final selections:", selections);
    });

    return () => {
      socket.off();
    };
  }, []);

  const handleJoin = () => {
    socket.emit('join-room', { roomId, username });
    setJoined(true);
  };

  const handleStart = () => {
    socket.emit('start-selection', { roomId });
  };

  const handlePick = (player) => {
    socket.emit('select-player', { roomId, playerName: player });
  };

  const isMyTurn = currentTurn.userId === socket.id;

  return (
    <div className="room-page">
      {!joined ? (
        <>
          <h2>Join or Create Room</h2>
          <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="Room ID" value={roomId} onChange={(e) => setRoomId(e.target.value)} />
          <button onClick={handleJoin}>Join Room</button>
        </>
      ) : (
        <>
          <div className="room-header">
            <h2>Room: {roomId}</h2>
            <p>Players: {roomData.users?.map(u => u.username).join(', ')}</p>
          </div>

          {roomData.started ? (
            <>
              <h3>Available Players</h3>
              <div className="available-players">
                {availablePlayers.map(p => (
                  <button key={p} onClick={() => handlePick(p)} disabled={!isMyTurn}>
                    {p}
                  </button>
                ))}
              </div>
              <p>Current turn: {currentTurn.username}</p>
            </>
          ) : (
            <>
              <button onClick={handleStart}>Start Selection</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default RoomPage;
