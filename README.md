## Setup Instructions

1. Create the project structure with all files above
2. Run: `docker-compose up --build`
3. Access the game at: http://localhost:3000

## How to Play

1. Click "Roll Dice" to roll all dice
2. Click on dice to keep them (blue border)
3. Roll again (up to 3 times total)
4. Choose a scoring category
5. Complete all 13 categories to finish the game

## Architecture

- **Backend**: Node.js WebSocket server (port 3001)
  - Handles game logic
  - Computes dice rolls and scores
  - Manages game state

- **Frontend**: Next.js app (port 3000)
  - Minimal UI
  - WebSocket client
  - Real-time state display

## Scoring Categories

- Ones through Sixes: Sum of matching dice
- Three/Four of a Kind: Sum of all dice if condition met
- Full House: 25 points
- Small Straight: 30 points
- Large Straight: 40 points
- Yatze (5 of a kind): 50 points
- Chance: Sum of all dice

## Development

Backend: `./backend`
Frontend: `./frontend`

Both services run in Docker containers with auto-restart.