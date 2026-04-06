import io from 'socket.io-client';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(BACKEND_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('[Socket] Connected:', this.socket.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('[Socket] Disconnected:', reason);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      // Clear all listeners
      this.listeners.clear();
      this.socket.disconnect();
      this.socket = null;
    }
  }

  createRoom(callback) {
    if (!this.socket?.connected) {
      this.connect();
    }

    this.socket.emit('create_room', (response) => {
      if (!response.success) {
        console.error('[Socket] Create room failed:', response.message);
      }
      callback(response);
    });
  }

  joinRoom(roomCode, userId, userName, callback) {
    if (!this.socket?.connected) {
      this.connect();
    }

    this.socket.emit(
      'join_room',
      { roomCode, userId, userName },
      (response) => {
        if (!response.success) {
          console.error('[Socket] Join room failed:', response.message);
        }
        callback(response);
      }
    );
  }

  getRoom(roomCode, callback) {
    if (!this.socket?.connected) {
      this.connect();
    }

    this.socket.emit('get_room', roomCode, (response) => {
      if (!response?.success) {
        console.error('[Socket] Get room failed');
      }
      callback(response);
    });
  }

  leaveRoom(roomCode) {
    if (this.socket?.connected) {
      this.socket.emit('leave_room', roomCode);
    }
  }

  /**
   * Register event listener (with cleanup tracking)
   */
  on(event, callback) {
    if (!this.socket?.connected) {
      this.connect();
    }

    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event).push(callback);
    this.socket.on(event, callback);
  }

  /**
   * Unregister all listeners for an event (or specific callback)
   */
  off(event, callback = null) {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(event, callback);
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    } else {
      // Remove all listeners for this event
      const callbacks = this.listeners.get(event) || [];
      callbacks.forEach((cb) => this.socket.off(event, cb));
      this.listeners.delete(event);
    }
  }

  emit(event, data) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn(`[Socket] Attempted to emit '${event}' while disconnected`);
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

const socketService = new SocketService();

export default socketService;
