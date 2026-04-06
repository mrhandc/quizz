import React, { useState, useEffect } from 'react';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import RoomDisplay from './components/RoomDisplay';
import socketService from './services/socketService';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('menu'); // menu, room
  const [roomData, setRoomData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');

  useEffect(() => {
    // Initialize socket connection
    socketService.connect();
    setConnectionStatus('connected');

    return () => {
      // Optional: cleanup on unmount
      // Note: not disconnecting to preserve connection state
    };
  }, []);

  const handleJoinSuccess = (data) => {
    setRoomData(data);
    setCurrentView('room');
  };

  const handleLeaveRoom = () => {
    setRoomData(null);
    setCurrentView('menu');
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>📝 Quiz Master</h1>
          <p>Real-time quiz app powered by Socket.IO</p>
        </div>
        {connectionStatus === 'connected' && (
          <div className="connection-status" aria-label="Connected to server">
            ● Connected
          </div>
        )}
      </header>

      <main className="app-main" role="main">
        {currentView === 'menu' && (
          <div className="menu-view">
            <div className="menu-container">
              <CreateRoom />
              <div className="divider" aria-hidden="true">
                OR
              </div>
              <JoinRoom onJoinSuccess={handleJoinSuccess} />
            </div>
          </div>
        )}

        {currentView === 'room' && roomData && (
          <div className="view-container">
            <RoomDisplay roomData={roomData} onLeave={handleLeaveRoom} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 Quiz Master. Built with React & Socket.IO</p>
      </footer>
    </div>
  );
}

export default App;
