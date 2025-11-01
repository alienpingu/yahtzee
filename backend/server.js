import { WebSocketServer } from 'ws';
import { Game } from './game.js';

const PORT = process.env.PORT || 3001;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server running on port ${PORT}`);

wss.on('connection', (ws) => {
  const game = new Game();
  
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    switch(data.type) {
      case 'ROLL':
        game.rollDice(data.keep);
        break;
      case 'SCORE':
        game.score(data.category);
        break;
      case 'NEW_GAME':
        game.reset();
        break;
    }
    
    ws.send(JSON.stringify({
      type: 'STATE',
      state: game.getState()
    }));
  });
  
  ws.send(JSON.stringify({
    type: 'STATE',
    state: game.getState()
  }));
});