# Quiz App Frontend

React frontend for real-time quiz application.

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
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

## Development

```bash
npm start
```

App opens at http://localhost:3000

## Build for Production

```bash
npm run build
```

## Environment Variables

- `REACT_APP_BACKEND_URL` - Backend API URL (default: http://localhost:5000)

## Deployment to Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `REACT_APP_BACKEND_URL`: https://your-backend.onrender.com
4. Deploy

## Features

- Create a room (generates 4-letter code)
- Join a room with code
- Real-time participant updates
- Copy room code to clipboard
- Responsive design
- Modern UI with gradient backgrounds

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── CreateRoom.js      - Create new quiz room
│   │   ├── JoinRoom.js        - Join existing room
│   │   └── RoomDisplay.js     - Show room info & participants
│   ├── services/
│   │   └── socketService.js   - Socket.IO client wrapper
│   ├── App.js                 - Main app component
│   ├── App.css                - Styles
│   └── index.js               - React entry point
├── public/
│   └── index.html
├── .env.example
├── package.json
└── README.md
```
