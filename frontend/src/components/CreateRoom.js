import React, { useState } from 'react';
import socketService from '../services/socketService';

function CreateRoom() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roomCode, setRoomCode] = useState(null);

  const handleCreateRoom = () => {
    setIsLoading(true);
    setError(null);

    socketService.createRoom((response) => {
      setIsLoading(false);

      if (response.success) {
        setRoomCode(response.roomCode);
      } else {
        setError(response.message || 'Failed to create room');
      }
    });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    alert('Room code copied to clipboard!');
  };

  if (roomCode) {
    return (
      <div className="create-room-container success">
        <h2>Room Created! 🎉</h2>
        <div className="room-code-box">
          <p>Share this code with participants:</p>
          <div className="code-display">{roomCode}</div>
          <button onClick={copyCode} className="btn btn-primary" aria-label="Copy room code">
            Copy Code
          </button>
        </div>
        <p className="help-text">Participants can join using the web interface or app</p>
      </div>
    );
  }

  return (
    <div className="create-room-container">
      <h2>Create a Quiz Room</h2>
      <p>As a host, create a new quiz room for your participants.</p>

      {error && <div className="error-message" role="alert">{error}</div>}

      <button
        onClick={handleCreateRoom}
        disabled={isLoading}
        className="btn btn-primary"
        aria-busy={isLoading}
        aria-label="Create new quiz room"
      >
        {isLoading ? 'Creating...' : 'Create Room'}
      </button>
    </div>
  );
}

export default CreateRoom;
