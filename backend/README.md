# Quiz App Backend

Express.js + Socket.IO server for real-time quiz application.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

3. Update `.env`:
   ```
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

## Development

Run with auto-reload:
```bash
npm run dev
```

## Production

```bash
npm start
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)
- `NODE_ENV` - Environment (development/production)

## Deployment to Render

1. Push to GitHub
2. Connect repository to Render
3. Set environment variables:
   - `PORT`: 5000
   - `FRONTEND_URL`: https://your-frontend.vercel.app
   - `NODE_ENV`: production
4. Deploy

## Socket Events

### Client → Server
- `create_room` - Create a new quiz room
- `join_room` - Join existing room with `{ roomCode, userId, userName }`
- `get_room` - Get room details
- `leave_room` - Leave room

### Server → Client
- `user_joined` - New user joined room
- `user_left` - User left room
