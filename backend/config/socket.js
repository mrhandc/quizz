import { Server } from 'socket.io';
import { logger } from '../utils/logger.js';
import { roomManager } from '../services/roomManager.js';
import { validateRoomCode } from '../utils/validation.js';
import { ValidationError, NotFoundError } from '../utils/errors.js';
import { ERRORS } from '../config/constants.js';

export const setupSocket = (httpServer) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  const io = new Server(httpServer, {
    cors: {
      origin: frontendUrl,
      methods: ['GET', 'POST'],
      credentials: true,
      maxHttpBufferSize: 1e6, // 1MB - prevent large payloads
    },
  });

  io.on('connection', (socket) => {
    logger.info('User connected', { socketId: socket.id });

    /**
     * Create a new room
     */
    socket.on('create_room', (callback) => {
      try {
        const room = roomManager.createRoom();
        socket.join(room.code);

        logger.info('Room created by user', {
          socketId: socket.id,
          roomCode: room.code,
        });

        callback({
          success: true,
          roomCode: room.code,
          message: 'Room created successfully',
        });
      } catch (error) {
        logger.error('Error creating room', error.message);
        callback({
          success: false,
          message: error.message || 'Failed to create room',
          code: error.name || 'ERROR',
        });
      }
    });

    /**
     * Join an existing room
     */
    socket.on('join_room', (data, callback) => {
      try {
        const { roomCode, userId, userName } = data;

        // Validate required fields
        if (!roomCode || !userId || !userName) {
          const error = new ValidationError(ERRORS.MISSING_FIELDS);
          callback({
            success: false,
            message: error.message,
            code: 'MISSING_FIELDS',
          });
          return;
        }

        // Validate room code format
        if (!validateRoomCode(String(roomCode).toUpperCase())) {
          const error = new ValidationError(ERRORS.INVALID_INPUT);
          callback({
            success: false,
            message: error.message,
            code: 'INVALID_FORMAT',
          });
          return;
        }

        const result = roomManager.joinRoom(
          String(roomCode).toUpperCase(),
          String(userId),
          String(userName)
        );

        socket.join(roomCode);
        logger.info('User joined room', {
          socketId: socket.id,
          roomCode,
          userId,
        });

        // Store room code in socket data
        socket.data.roomCode = roomCode;
        socket.data.userId = userId;

        // Notify others in the room
        io.to(roomCode).emit('user_joined', {
          userId,
          userName: result.room.participants[result.room.participants.length - 1].name,
          participantCount: result.room.participants.length,
        });

        callback({
          success: true,
          room: result.room,
          message: result.message,
        });
      } catch (error) {
        logger.error('Error joining room', error.message);
        callback({
          success: false,
          message: error.message || 'Failed to join room',
          code: error.name || 'ERROR',
        });
      }
    });

    /**
     * Get room details
     */
    socket.on('get_room', (roomCode, callback) => {
      try {
        const room = roomManager.getRoom(roomCode);

        if (room) {
          callback({
            success: true,
            room,
          });
        } else {
          callback({
            success: false,
            message: 'Room not found',
          });
        }
      } catch (error) {
        logger.error('Error getting room', error.message);
        callback({
          success: false,
          message: 'Failed to get room',
        });
      }
    });

    /**
     * Leave room
     */
    socket.on('leave_room', (roomCode) => {
      try {
        if (socket.data.roomCode === roomCode) {
          roomManager.leaveRoom(roomCode, socket.data.userId);
          socket.leave(roomCode);

          logger.info('User left room', {
            socketId: socket.id,
            roomCode,
          });

          // Notify others
          io.to(roomCode).emit('user_left', {
            userId: socket.data.userId,
          });
        }
      } catch (error) {
        logger.error('Error leaving room', error.message);
      }
    });

    /**
     * Disconnect handler
     */
    socket.on('disconnect', () => {
      try {
        const { roomCode, userId } = socket.data;

        if (roomCode) {
          roomManager.leaveRoom(roomCode, userId);
          io.to(roomCode).emit('user_left', { userId });
        }

        logger.info('User disconnected', { socketId: socket.id });
      } catch (error) {
        logger.error('Error on disconnect', error.message);
      }
    });
  });

  return io;
};
