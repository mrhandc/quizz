export const ROOM_CONFIG = {
  CODE_LENGTH: 4,
  MAX_PARTICIPANTS: 100,
  MAX_USERNAME_LENGTH: 50,
  ROOM_CLEANUP_TIMEOUT: 3600000, // 1 hour
};

export const VALIDATION = {
  ROOM_CODE_REGEX: /^[A-Z]{4}$/,
  USERNAME_REGEX: /^[a-zA-Z0-9\s\-_.]{1,50}$/,
};

export const ERRORS = {
  ROOM_NOT_FOUND: 'Room not found',
  ROOM_FULL: 'Room is full',
  INVALID_INPUT: 'Invalid input',
  ALREADY_IN_ROOM: 'Already in this room',
  MISSING_FIELDS: 'Missing required fields',
};
