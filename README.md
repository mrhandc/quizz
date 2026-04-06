# Quiz Master - Real-time Quiz App

A production-ready real-time quiz application built with React, Node.js/Express, and Socket.IO. Simple, secure, and scalable.

## Project Structure

```
qzz/
├── backend/                   # Node.js + Express server
│   ├── config/
│   │   └── socket.js         # Socket.IO configuration
│   ├── services/
│   │   └── roomManager.js    # Room management logic
│   ├── utils/
│   │   └── logger.js         # Logging utility
│   ├── server.js             # Express server entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/                  # React app
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateRoom.js      # Host: Create quiz room
│   │   │   ├── JoinRoom.js        # Participant: Join room
│   │   │   └── RoomDisplay.js     # Show room info & participants
│   │   ├── services/
│   │   │   └── socketService.js   # Socket.IO wrapper
│   │   ├── App.js                 # Main component
│   │   ├── App.css                # Styles
│   │   └── index.js               # React entry point
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── README.md                  # This file
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm installed
- Git

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup (New Terminal)

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Frontend runs on `http://localhost:3000`

## Features

✅ **Create Room** - Host generates random 4-letter room code  
✅ **Join Room** - Participants join with code + name  
✅ **Real-time Updates** - Instant participant list syncing  
✅ **Clean UI** - Modern React with responsive design  
✅ **Environment Variables** - Configuration for different environments  
✅ **Logging** - Structured logging for debugging  
✅ **Production-Ready** - Ready for Render & Vercel deployment  

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Node.js, Express, Socket.IO |
| **Frontend** | React 18, Socket.IO Client |
| **Real-time** | Socket.IO with auto-reconnect |
| **Styling** | CSS3 with responsive design |

## Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   React App     │◄────────► Socket.IO Server │
│  (Vercel)       │ WebSocket │ (Render)       │
└─────────────────┘         └──────────────────┘
       │                            │
       │ HTTP/WS                    │ In-Memory
       ├──────────────────────────► Storage
       │                            │
       └─ Environment Variables ────┘
```

## API Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `create_room` | - | Create new quiz room |
| `join_room` | `{ roomCode, userId, userName }` | Join existing room |
| `get_room` | `roomCode` | Fetch room details |
| `leave_room` | `roomCode` | Leave room |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `user_joined` | `{ userId, userName, participantCount }` | User joined room |
| `user_left` | `{ userId }` | User left room |

## Environment Variables

### Backend (.env)

```
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env)

```
REACT_APP_BACKEND_URL=http://localhost:5000
```

## Deployment

### Backend to Render

1. Push to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Set environment variables:
   - `PORT`: 5000
   - `FRONTEND_URL`: https://your-frontend.vercel.app
   - `NODE_ENV`: production
5. Deploy

### Frontend to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set environment variable:
   - `REACT_APP_BACKEND_URL`: https://your-backend.onrender.com
4. Deploy

## File Purposes

### Backend Files

- **server.js** - Express app, HTTP server setup, health check endpoint
- **config/socket.js** - Socket.IO initialization with CORS, event handlers
- **services/roomManager.js** - Room creation, joining, leaving logic
- **utils/logger.js** - Timestamp & structured logging

### Frontend Files

- **App.js** - Main component, view routing (menu/room)
- **App.css** - Responsive styles, gradients, animations
- **components/CreateRoom.js** - UI for creating room
- **components/JoinRoom.js** - Form for joining room with code & name
- **components/RoomDisplay.js** - Room info, participant list, leave button
- **services/socketService.js** - Socket.IO singleton wrapper

## How It Works

1. **Host Flow**
   - Click "Create Room"
   - Backend generates random 4-letter code (e.g., "ABCD")
   - Share code with participants

2. **Participant Flow**
   - Enter room code + name
   - Click "Join Room"
   - Real-time participant list updates for everyone
   - See all participants in the room

3. **Real-time Sync**
   - Socket.IO handles all real-time updates
   - Auto-reconnect if connection drops
   - Room data stored temporarily in Node.js memory
   - Rooms deleted when last participant leaves

## Development

### Adding Features

1. **Backend**: Add events to [backend/config/socket.js](backend/config/socket.js)
2. **Frontend**: Add handlers in components using `socketService`
3. **Logic**: Add business logic to [backend/services/roomManager.js](backend/services/roomManager.js)

### Logging

Backend uses structured logging:

```javascript
import { logger } from './utils/logger.js';

logger.info('User action', data);
logger.error('Something failed', error.message);
logger.warn('Warning message', data);
logger.debug('Debug info', data);  // Only in development
```

### Testing Locally

1. Open `http://localhost:3000` in two browser tabs
2. Tab 1: Create room, get code
3. Tab 2: Join with code from Tab 1
4. See real-time participant updates

## Production Considerations

✅ Environment variables for all URLs  
✅ CORS properly configured  
✅ Auto-reconnect on connection loss  
✅ Graceful shutdown on SIGTERM  
✅ Structured logging  
✅ Error handling on all socket events  
✅ Room cleanup on participant disconnect  
✅ Max participants limit per room  

## Debugging

### Backend Logs

```bash
cd backend
npm run dev
# Logs show: [INFO], [ERROR], [WARN], [DEBUG]
```

### Frontend Connection

Open browser DevTools → Network tab → WS → Messages tab to see socket events.

### Common Issues

| Issue | Solution |
|-------|----------|
| "Cannot connect to socket" | Check `REACT_APP_BACKEND_URL` env var |
| "Room not found" | Code expired (room deleted when empty) |
| "CORS error" | Check `FRONTEND_URL` in backend `.env` |
| Logging not showing | Check `NODE_ENV=development` on backend |

## Security Notes

- 4-letter room codes provide basic privacy (not security)
- For production: Add authentication, rate limiting, input validation
- Room codes can be brute-forced (implement protection if needed)
- Data stored in memory only (no persistence)

## Next Steps

To extend this app:

1. **Add quiz questions**: Store questions, send in bulk
2. **Score tracking**: Emit answer events, calculate scores
3. **Timer**: Broadcast countdown from server
4. **Database**: Persist rooms, history, scores
5. **Authentication**: User login, admin dashboard
6. **Mobile app**: React Native version

## License

MIT

## Support

For issues or questions, check the individual README files in [backend/](backend/README.md) and [frontend/](frontend/README.md).
