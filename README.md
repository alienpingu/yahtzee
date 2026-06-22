# Yatze

A classic dice game with single-player and real-time multiplayer (2-4 players).

## Quick Start

```bash
docker compose up --build
```

Open http://localhost:3000

## Features

- **Start screen** with Play, Rules, and About
- **Single player** practice mode
- **Multiplayer** with room codes (2-4 players, strict turn-based)
- **Auto-save** — refresh or reconnect resumes your game
- **SQLite** persistence (survives backend restarts)

## Architecture

Two containers, no external dependencies:

- **backend** (port 3001): Node.js WebSocket server
  - Game engine (dice, scoring, turn rotation)
  - In-memory game registry, broadcast to connected clients
  - SQLite for persistence (`better-sqlite3`)
  - Auto-reloads active games on restart

- **frontend** (port 3000): Next.js app
  - Start screen, lobby, game views
  - WebSocket client with auto-reconnect
  - localStorage for player identity and game resume

## How to Play

1. Click **Play**, enter your name
2. Choose **Single player** or **Create multiplayer game** (share the 4-char code)
3. Others join with the code; host clicks **Start**
4. On your turn: roll dice (up to 3x), click dice to keep them
5. Pick a scoring category to end your turn
6. Complete all 13 categories — highest score wins

## Scoring

- **Ones-Sixes**: Sum of matching dice
- **Three/Four of a Kind**: Sum of all dice if condition met
- **Full House**: 25 (3+2)
- **Small/Large Straight**: 30/40 (4/5 consecutive)
- **Yatze**: 50 (all 5 same)
- **Chance**: Sum of all dice
