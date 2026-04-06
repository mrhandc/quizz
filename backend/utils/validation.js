import { VALIDATION } from '../config/constants.js';

export const sanitizeString = (str, maxLength = 100) => {
  if (typeof str !== 'string') return '';
  return str.trim().slice(0, maxLength);
};

export const validateRoomCode = (code) => {
  return VALIDATION.ROOM_CODE_REGEX.test(code);
};

export const validateUsername = (username) => {
  const sanitized = sanitizeString(username, 50);
  return (
    sanitized.length > 0 &&
    sanitized.length <= 50 &&
    VALIDATION.USERNAME_REGEX.test(sanitized)
  );
};

export const validateUserId = (userId) => {
  return typeof userId === 'string' && userId.length > 0 && userId.length < 200;
};
