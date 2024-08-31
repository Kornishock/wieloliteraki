const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const letterList = [
  { letter: 'A', count: 9, points: 1 },
  { letter: 'B', count: 2, points: 3 },
  { letter: 'C', count: 2, points: 3 },
  { letter: 'D', count: 4, points: 2 },
  { letter: 'E', count: 12, points: 1 },
  { letter: 'F', count: 2, points: 4 },
  { letter: 'G', count: 3, points: 2 },
  { letter: 'H', count: 2, points: 4 },
  { letter: 'I', count: 9, points: 1 },
  { letter: 'J', count: 1, points: 8 },
  { letter: 'K', count: 1, points: 5 },
  { letter: 'L', count: 4, points: 1 },
  { letter: 'M', count: 2, points: 3 },
  { letter: 'N', count: 6, points: 1 },
  { letter: 'O', count: 8, points: 1 },
  { letter: 'P', count: 2, points: 3 },
  { letter: 'Q', count: 1, points: 10 },
  { letter: 'R', count: 6, points: 1 },
  { letter: 'S', count: 4, points: 1 },
  { letter: 'T', count: 6, points: 1 },
  { letter: 'U', count: 4, points: 1 },
  { letter: 'V', count: 2, points: 4 },
  { letter: 'W', count: 2, points: 4 },
  { letter: 'X', count: 1, points: 8 },
  { letter: 'Y', count: 2, points: 4 },
  { letter: 'Z', count: 1, points: 10 }
];

let letterBag = [];
// Initialize letter bag based on letter list
function initializeLetterBag() {
  letterBag = [];
  letterList.forEach(letterInfo => {
    for (let i = 0; i < letterInfo.count; i++) {
      letterBag.push(letterInfo.letter);
    }
  });
}

// Serve static files from 'public' directory
app.use(express.static('public'));

// Object to store player names with socket IDs
const players = {};

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Socket.io connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle setting player names
  socket.on('setName', (name) => {
    console.log('Received name:', name, 'from', socket.id); // Debug log
    players[socket.id] = name;
    io.emit('updatePlayerList', Object.values(players));
  });

  // Handle starting the game
  socket.on('startGame', () => {
    console.log('Game started by:', players[socket.id]);
    io.emit('gameStarted');
    initializeLetterBag(); // Initialize letter bag
    io.emit('gameStarted', letterBag); // Send letter bag to clients
    console.log(letterBag)
  });

  // Handle disconnections
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete players[socket.id];
    io.emit('updatePlayerList', Object.values(players));
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
