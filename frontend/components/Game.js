'use client';

import { useState, useEffect, useRef } from 'react';

const CATEGORIES = [
  { key: 'ones', label: 'Ones' },
  { key: 'twos', label: 'Twos' },
  { key: 'threes', label: 'Threes' },
  { key: 'fours', label: 'Fours' },
  { key: 'fives', label: 'Fives' },
  { key: 'sixes', label: 'Sixes' },
  { key: 'threeOfKind', label: 'Three of a Kind' },
  { key: 'fourOfKind', label: 'Four of a Kind' },
  { key: 'fullHouse', label: 'Full House' },
  { key: 'smallStraight', label: 'Small Straight' },
  { key: 'largeStraight', label: 'Large Straight' },
  { key: 'yatze', label: 'Yatze' },
  { key: 'chance', label: 'Chance' },
];

export default function Game() {
  const [gameState, setGameState] = useState(null);
  const [kept, setKept] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
    ws.current = new WebSocket(wsUrl);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'STATE') {
        setGameState(data.state);
      }
    };

    return () => ws.current?.close();
  }, []);

  const send = (data) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  };

  const rollDice = () => {
    send({ type: 'ROLL', keep: kept });
  };

  const scoreCategory = (category) => {
    send({ type: 'SCORE', category });
    setKept([]);
  };

  const toggleKeep = (index) => {
    setKept(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const newGame = () => {
    send({ type: 'NEW_GAME' });
    setKept([]);
  };

  if (!gameState) return <div>Connecting...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Yatze Game</h1>
      
      <div>
        <p>Rolls left: {gameState.rollsLeft}</p>
        <p>Round: {gameState.currentRound}/13</p>
        <p>Total Score: {gameState.totalScore}</p>
      </div>

      <div style={{ margin: '20px 0' }}>
        {gameState.dice.map((die, i) => (
          <button 
            key={i}
            onClick={() => toggleKeep(i)}
            style={{ 
              margin: '5px', 
              padding: '10px 20px',
              border: kept.includes(i) ? '2px solid blue' : '1px solid black'
            }}
          >
            {die || '-'}
          </button>
        ))}
      </div>

      <button 
        onClick={rollDice} 
        disabled={gameState.rollsLeft === 0}
        style={{ padding: '10px 20px', margin: '5px' }}
      >
        Roll Dice
      </button>

      <h2>Score Categories</h2>
      <div>
        {CATEGORIES.map(cat => (
          <div key={cat.key} style={{ margin: '5px 0' }}>
            <button 
              onClick={() => scoreCategory(cat.key)}
              disabled={gameState.scores[cat.key] !== undefined || gameState.rollsLeft === 3}
              style={{ padding: '5px 10px', width: '200px' }}
            >
              {cat.label}
            </button>
            <span style={{ marginLeft: '10px' }}>
              {gameState.scores[cat.key] !== undefined ? gameState.scores[cat.key] : '-'}
            </span>
          </div>
        ))}
      </div>

      <button onClick={newGame} style={{ padding: '10px 20px', marginTop: '20px' }}>
        New Game
      </button>
    </div>
  );
}