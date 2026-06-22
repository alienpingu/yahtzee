import { WebSocketServer } from 'ws';
import * as db from './db.js';
import { Game } from './game.js';

const PORT = process.env.PORT || 3001;
const wss = new WebSocketServer({ port: PORT });

const games = new Map();
const codeIndex = new Map();
const connections = new Map();

for (const row of db.listActiveGames()) {
  if (!row.state) continue;
  const g = Game.hydrate(JSON.parse(row.state));
  g.id = row.id;
  g.code = row.code;
  games.set(row.id, g);
  codeIndex.set(row.code, row.id);
  connections.set(row.id, new Set());
}
console.log(`Loaded ${games.size} active game(s) from DB`);

function register(game) {
  games.set(game.id, game);
  codeIndex.set(game.code, game.id);
  if (!connections.has(game.id)) connections.set(game.id, new Set());
}

function getGameById(id) {
  let game = games.get(id);
  if (!game) {
    const row = db.getGameById(id);
    if (!row || !row.state) return null;
    game = Game.hydrate(JSON.parse(row.state));
    game.id = row.id;
    game.code = row.code;
    register(game);
  }
  return game;
}

function getGameByCode(code) {
  const upper = String(code).toUpperCase();
  const id = codeIndex.get(upper);
  if (id) return games.get(id);
  const row = db.getGameByCode(upper);
  if (!row || !row.state) return null;
  const game = Game.hydrate(JSON.parse(row.state));
  game.id = row.id;
  game.code = row.code;
  register(game);
  return game;
}

function broadcast(game) {
  const msg = JSON.stringify({ type: 'STATE', state: game.toState() });
  const conns = connections.get(game.id);
  if (conns) {
    for (const ws of conns) {
      if (ws.readyState === ws.OPEN) ws.send(msg);
    }
  }
}

function addToGame(ws, gameId) {
  if (ws.gameId) {
    const oldConns = connections.get(ws.gameId);
    if (oldConns) oldConns.delete(ws);
  }
  ws.gameId = gameId;
  if (!connections.has(gameId)) connections.set(gameId, new Set());
  connections.get(gameId).add(ws);
}

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    let data;
    try { data = JSON.parse(message); } catch { return; }

    try {
      switch (data.type) {
        case 'IDENTIFY': {
          const name = String(data.name || '').trim();
          if (!name) throw new Error('Name required');
          const player = db.getOrCreatePlayer(name);
          ws.send(JSON.stringify({ type: 'IDENTIFIED', player }));
          break;
        }

        case 'SOLO':
        case 'CREATE': {
          const player = db.getPlayer(Number(data.playerId));
          if (!player) throw new Error('Player not found');
          const row = db.createGame();
          const game = Game.create(row.id, row.code, player);
          register(game);
          if (data.type === 'SOLO') game.start(player.id);
          db.saveGame(game);
          addToGame(ws, game.id);
          broadcast(game);
          break;
        }

        case 'JOIN': {
          const player = db.getPlayer(Number(data.playerId));
          if (!player) throw new Error('Player not found');
          const game = getGameByCode(data.code);
          if (!game) throw new Error('Game not found');
          const seat = game.addPlayer(player);
          addToGame(ws, game.id);
          db.saveGame(game);
          broadcast(game);
          break;
        }

        case 'REJOIN': {
          const game = getGameById(Number(data.gameId));
          if (!game) throw new Error('Game not found');
          addToGame(ws, game.id);
          ws.send(JSON.stringify({ type: 'STATE', state: game.toState() }));
          break;
        }

        case 'START': {
          const game = getGameById(Number(data.gameId));
          if (!game) throw new Error('Game not found');
          game.start(Number(data.playerId));
          db.saveGame(game);
          broadcast(game);
          break;
        }

        case 'ROLL': {
          const game = getGameById(Number(data.gameId));
          if (!game) throw new Error('Game not found');
          game.roll(Number(data.playerId), data.keep || []);
          db.saveGame(game);
          broadcast(game);
          break;
        }

        case 'SCORE': {
          const game = getGameById(Number(data.gameId));
          if (!game) throw new Error('Game not found');
          game.score(Number(data.playerId), data.category);
          db.saveGame(game);
          broadcast(game);
          break;
        }

        case 'LEAVE': {
          if (ws.gameId) {
            const conns = connections.get(ws.gameId);
            if (conns) conns.delete(ws);
            ws.gameId = null;
          }
          break;
        }
      }
    } catch (e) {
      ws.send(JSON.stringify({ type: 'ERROR', error: e.message }));
    }
  });

  ws.on('close', () => {
    if (ws.gameId) {
      const conns = connections.get(ws.gameId);
      if (conns) conns.delete(ws);
    }
  });
});

console.log(`WebSocket server running on port ${PORT}`);
