import { logger } from '../utils/logger.js';
import { sanitizeString, validateUsername, validateUserId } from '../utils/validation.js';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errors.js';
import { ROOM_CONFIG, ERRORS } from '../config/constants.js';

class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.codeAttempts = 0;
    this.maxAttempts = 1000;
  }

  /**
   * Generate a random 4-letter room code (iterative, not recursive)
   */
  generateRoomCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let attempts = 0;

    while (attempts < this.maxAttempts) {
      let code = '';
      for (let i = 0; i < ROOM_CONFIG.CODE_LENGTH; i++) {
        code += letters.charAt(Math.floor(Math.random() * letters.length));
      }

      if (!this.rooms.has(code)) {
        return code;
      }
      attempts++;
    }

    throw new Error('Unable to generate unique room code after max attempts');
  }

  /**
   * Create a new room
   */
  createRoom() {
    const code = this.generateRoomCode();
    const room = {
      code,
      host: null,
      participants: [],
      createdAt: new Date(),
      maxParticipants: 100,
    };

    this.rooms.set(code, room);
    logger.info(`Room created`, { code });

    return room;
  }

  /**
   * Join an existing room
   */
  joinRoom(roomCode, userId, userName) {
    // Validate inputs
    if (!validateUserId(userId) || !validateUsername(userName)) {
      throw new ValidationError(ERRORS.INVALID_INPUT);
    }

    const room = this.rooms.get(roomCode);
    if (!room) {
      logger.warn(`Attempt to join non-existent room`, { roomCode });
      throw new NotFoundError(ERRORS.ROOM_NOT_FOUND);
    }

    if (room.participants.length >= room.maxParticipants) {
      logger.warn(`Room full`, { roomCode });
      throw new ConflictError(ERRORS.ROOM_FULL);
    }

    // Check if participant already in room
    const alreadyJoined = room.participants.some((p) => p.id === userId);
    if (alreadyJoined) {
      logger.warn(`User already in room`, { roomCode, userId });
      throw new ConflictError(ERRORS.ALREADY_IN_ROOM);
    }

    const participant = {
      id: userId,
      name: sanitizeString(userName, ROOM_CONFIG.MAX_USERNAME_LENGTH),
      joinedAt: new Date(),
    };

    room.participants.push(participant);
    logger.info(`User joined room`, { roomCode, userId, userName });

    return {
      success: true,
      room,
      message: 'Successfully joined room',
    };
  }

  /**
   * Leave a room
   */
  leaveRoom(roomCode, userId) {
    const room = this.rooms.get(roomCode);

    if (!room) {
      return { success: false, message: 'Room not found' };
    }

    const index = room.participants.findIndex((p) => p.id === userId);
    if (index > -1) {
      room.participants.splice(index, 1);
      logger.info(`User left room`, { roomCode, userId });
    }

    // Delete room if empty
    if (room.participants.length === 0) {
      this.rooms.delete(roomCode);
      logger.info(`Room deleted (empty)`, { roomCode });
    }

    return { success: true };
  }

  /**
   * Get room details
   */
  getRoom(roomCode) {
    return this.rooms.get(roomCode);
  }

  /**
   * Get all rooms (for debugging)
   */
  getAllRooms() {
    return Array.from(this.rooms.values());
  }
}

export const roomManager = new RoomManager();
