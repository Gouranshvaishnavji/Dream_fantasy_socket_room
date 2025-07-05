import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomPage from './pages/RoomPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomPage />} />
      </Routes>
    </Router>
  );
}

export default App;
