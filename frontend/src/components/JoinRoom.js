import React, { useState } from 'react';
import PropTypes from 'prop-types';
import socketService from '../services/socketService';

function JoinRoom({ onJoinSuccess }) {
  const [roomCode, setRoomCode] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleJoin = (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }

    if (!userName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (userName.trim().length > 50) {
      setError('Name must be 50 characters or less');
      return;
    }

    setIsLoading(true);

    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    socketService.joinRoom(
      roomCode.toUpperCase(),
      userId,
      userName.trim(),
      (response) => {
        setIsLoading(false);

        if (response.success) {
          onJoinSuccess({
            roomCode: roomCode.toUpperCase(),
            userId,
            userName: userName.trim(),
            room: response.room,
          });
        } else {
          setError(response.message || 'Failed to join room');
        }
      }
    );
  };

  return (
    <div className="join-room-container">
      <h2>Join a Quiz Room</h2>
      <form onSubmit={handleJoin} className="join-form" noValidate>
        <div className="form-group">
          <label htmlFor="roomCode">Room Code</label>
          <input
            id="roomCode"
            type="text"
            placeholder="e.g., ABCD"
            maxLength="4"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            disabled={isLoading}
            className="form-input"
            aria-invalid={!!error}
            aria-describedby={error ? 'error-message' : undefined}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="userName">Your Name</label>
          <input
            id="userName"
            type="text"
            placeholder="Enter your name"
            maxLength="50"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            disabled={isLoading}
            className="form-input"
            aria-invalid={!!error}
            aria-describedby={error ? 'error-message' : undefined}
            required
          />
        </div>

        {error && (
          <div id="error-message" className="error-message" role="alert">
            {error}
          </div>
        )}

        <button type="submit" disabled={isLoading} className="btn btn-primary" aria-busy={isLoading}>
          {isLoading ? 'Joining...' : 'Join Room'}
        </button>
      </form>
    </div>
  );
}

JoinRoom.propTypes = {
  onJoinSuccess: PropTypes.func.isRequired,
};

export default JoinRoom;
