const socket = io();

// Elements
const nameInput = document.getElementById('nameInput');
const setNameButton = document.getElementById('setNameButton');
const playerList = document.getElementById('playerList');
const startGameButton = document.getElementById('startGameButton');
const gameBoard = document.getElementById('gameBoard');
const boardContainer = document.getElementById('boardContainer');

// Set player's name when button is clicked
setNameButton.addEventListener('click', () => {
  console.log('Set Name button clicked'); // Debug log
  const name = nameInput.value.trim();
  if (name) {
    console.log('Emitting setName with:', name); // Debug log
    socket.emit('setName', name);
    nameInput.disabled = true;
    setNameButton.disabled = true;
    startGameButton.style.display = 'block';
  }
});

// Start the game when the Start Game button is clicked
startGameButton.addEventListener('click', () => {
  console.log('Start Game button clicked'); // Debug log
  socket.emit('startGame');
});

// Function to create a 2D game board of size n x n
function createGameBoard(n) {
  const table = document.createElement('table');
  for (let i = 0; i < n; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < n; j++) {
      const cell = document.createElement('td');
      cell.textContent = ''; // Empty cell initially
      row.appendChild(cell);
    }
    table.appendChild(row);
  }
  boardContainer.innerHTML = ''; // Clear any existing board
  boardContainer.appendChild(table);
}

// Listen for 'updatePlayerList' event from server
socket.on('updatePlayerList', (players) => {
  console.log('Received player list:', players); // Debug log
  playerList.innerHTML = '';
  players.forEach(playerName => {
    const li = document.createElement('li');
    li.textContent = playerName;
    playerList.appendChild(li);
  });
});

// Listen for 'gameStarted' event from server
socket.on('gameStarted', () => {
  console.log('Game started'); // Debug log
  startGameButton.style.display = 'none';
  gameBoard.style.display = 'block';
  createGameBoard(15); // Create a 15x15 board, for example
});
