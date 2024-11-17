**GitHub Description**:  
A fully functional custom chess game built using Node.js, Express.js, Socket.io, Chess.js, EJS, and Tailwind CSS. Features real-time multiplayer gameplay with role assignment, drag-and-drop functionality, dynamic board rendering, and backend validation for smooth and fair gameplay.  

**README.md**:  

# Custom Chess Game  

## Overview  
This is a custom chess game application that allows players to play chess in real time. The game includes features like role assignment (Player or Spectator), drag-and-drop for piece movement, and dynamic board updates.  

## Features  
- **Real-Time Gameplay**: Multiplayer functionality using Socket.io.  
- **Role Assignment**: Players are assigned as White, Black, or Spectator based on availability.  
- **Dynamic Board Updates**: Game state is updated and rendered dynamically using FEN notation.  
- **Drag-and-Drop**: Intuitive piece movement with real-time validation.  
- **Backend Validation**: Ensures fair gameplay by validating turns and moves.  

## Tech Stack  
### Server  
- Node.js  
- Express.js  
- Socket.io  

### Backend  
- Chess.js (for chess logic)  

### Frontend  
- EJS templating  
- Tailwind CSS (for styling)  

## Setup Instructions  
1. Clone this repository:  
   ```bash  
   git clone <repository-url>  
   ```  

2. Navigate to the project directory:  
   ```bash  
   cd custom-chess-game  
   ```  

3. Install dependencies:  
   ```bash  
   npm install  
   ```  

4. Start the server:  
   ```bash  
   npm start  
   ```  

5. Open your browser and navigate to:  
   ```
   http://localhost:3000  
   ```  

## How It Works  
- Players connect to the game via the browser.  
- Roles are assigned dynamically: White, Black, or Spectator.  
- Moves are validated server-side to ensure correct turns and legality.  
- The chessboard updates in real time for all players.  

## Contributing  
Feel free to fork the repository and create pull requests for improvements or additional features.  

## License  
This project is licensed under the MIT License.  

---  
