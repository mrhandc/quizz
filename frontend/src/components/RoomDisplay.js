import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import socketService from '../services/socketService';

function RoomDisplay({ roomData, onLeave }) {
  const [participants, setParticipants] = useState(roomData.room.participants || []);
  const [error, setError] = useState(null);

  const handleUserJoined = useCallback((data) => {
    console.log('User joined:', data);
    setParticipants((prev) => {
      // Avoid duplicates by checking if user already exists
      const exists = prev.some((p) => p.id === data.userId);
      if (exists) return prev;
      return [...prev, { id: data.userId, name: data.userName, joinedAt: new Date() }];
    });
  }, []);

  const handleUserLeft = useCallback((data) => {
    console.log('User left:', data);
    setParticipants((prev) => prev.filter((p) => p.id !== data.userId));
  }, []);

  useEffect(() => {
    // Listen for room updates
    socketService.on('user_joined', handleUserJoined);
    socketService.on('user_left', handleUserLeft);

    // Cleanup listeners
    return () => {
      socketService.off('user_joined', handleUserJoined);
      socketService.off('user_left', handleUserLeft);
    };
  }, [handleUserJoined, handleUserLeft]);

  const handleLeave = () => {
    try {
      socketService.leaveRoom(roomData.roomCode);
      onLeave();
    } catch (err) {
      setError('Failed to leave room');
      console.error(err);
    }
  };

  const copyCode = () => {
    navigator.clipboard
      .writeText(roomData.roomCode)
      .then(() => {
        alert('Room code copied to clipboard!');
      })
      .catch(() => {
        setError('Failed to copy to clipboard');
      });
  };

  return (
    <div className="room-display-container">
      <div className="room-header">
        <h1>Quiz Room</h1>
        <button
          onClick={handleLeave}
          className="btn btn-secondary"
          aria-label="Leave the quiz room"
        >
          Leave Room
        </button>
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}

      <div className="room-info">
        <div className="room-code-section">
          <label htmlFor="room-code-display">Room Code</label>
          <div className="room-code-display">
            <span id="room-code-display" className="code" aria-label={`Room code: ${roomData.roomCode}`}>
              {roomData.roomCode}
            </span>
            <button
              onClick={copyCode}
              className="btn btn-small"
              aria-label="Copy room code to clipboard"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="user-info">
          <p>
            <strong>Your Name:</strong> {roomData.userName}
          </p>
          <p>
            <strong>Participants:</strong> <span aria-live="polite" aria-atomic="true">{participants.length}</span>
          </p>
        </div>
      </div>

      <div className="participants-section">
        <h2>Participants ({participants.length})</h2>
        <div className="participants-list" role="list">
          {participants.length === 0 ? (
            <p className="no-participants">Waiting for participants to join...</p>
          ) : (
            participants.map((participant) => (
              <div key={participant.id} className="participant-item" role="listitem">
                <span className="participant-name">{participant.name}</span>
                <span className="participant-joined">
                  Joined: {new Date(participant.joinedAt).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="room-status">
        <p className="status-badge">Room is active and waiting for quiz to start</p>
      </div>
    </div>
  );
}

RoomDisplay.propTypes = {
  roomData: PropTypes.shape({
    roomCode: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    room: PropTypes.shape({
      participants: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          joinedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
        })
      ),
    }).isRequired,
  }).isRequired,
  onLeave: PropTypes.func.isRequired,
};

export default RoomDisplay;
