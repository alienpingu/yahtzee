'use client';

import { useState, useEffect } from 'react';

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

export default function Game({ gameState, player, onRoll, onScore, onLeave, error }) {
  const [kept, setKept] = useState([]);

  useEffect(() => {
    if (gameState && gameState.rollsLeft === 3) setKept([]);
  }, [gameState?.rollsLeft]);

  if (!gameState) return <div>Connecting...</div>;

  const myPlayer = gameState.players.find(p => p.playerId === player.id);
  const isMyTurn = gameState.currentTurnPlayerId === player.id;
  const opponents = gameState.players.filter(p => p.playerId !== player.id);
  const gameComplete = gameState.status === 'completed';
  const currentTurnName = gameState.players.find(p => p.playerId === gameState.currentTurnPlayerId)?.name;
  const winnerName = gameState.players.find(p => p.playerId === gameState.winnerPlayerId)?.name;

  const rollDice = () => {
    onRoll(kept);
  };

  const scoreCategory = (category) => {
    onScore(category);
    setKept([]);
  };

  const toggleKeep = (index) => {
    setKept(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Yatze Game</h1>

      {gameComplete ? (
        <div style={{ margin: '10px 0', padding: '10px', border: '2px solid green' }}>
          <h2 style={{ margin: 0 }}>Game Over!</h2>
          <p>{winnerName === player.name ? 'You won!' : `Winner: ${winnerName || ''}`}</p>
        </div>
      ) : (
        <p style={{ fontWeight: 'bold' }}>
          {isMyTurn ? 'Your turn!' : `Waiting for ${currentTurnName}...`}
        </p>
      )}

      <div>
        <p>Rolls left: {gameState.rollsLeft}</p>
        <p>Round: {gameState.round}/13</p>
        <p>Total Score: {myPlayer?.totalScore ?? 0}</p>
      </div>

      <div style={{ margin: '20px 0' }}>
        {gameState.dice.map((die, i) => (
          <button
            key={i}
            onClick={() => toggleKeep(i)}
            disabled={!isMyTurn || gameComplete || gameState.rollsLeft === 0}
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
        disabled={!isMyTurn || gameComplete || gameState.rollsLeft === 0}
        style={{ padding: '10px 20px', margin: '5px' }}
      >
        Roll Dice
      </button>

      <h2>Your Scorecard</h2>
      <div>
        {CATEGORIES.map(cat => (
          <div key={cat.key} style={{ margin: '5px 0' }}>
            <button
              onClick={() => scoreCategory(cat.key)}
              disabled={!isMyTurn || gameComplete || myPlayer?.scorecard[cat.key] !== undefined || gameState.rollsLeft === 3}
              style={{ padding: '5px 10px', width: '200px' }}
            >
              {cat.label}
            </button>
            <span style={{ marginLeft: '10px' }}>
              {myPlayer?.scorecard[cat.key] !== undefined ? myPlayer.scorecard[cat.key] : '-'}
            </span>
          </div>
        ))}
      </div>

      {opponents.length > 0 && (
        <div>
          <h2>Opponents</h2>
          {opponents.map(op => (
            <div key={op.playerId} style={{ margin: '10px 0' }}>
              <strong>{op.name}: {op.totalScore} points</strong>
              <div style={{ fontSize: '12px', marginLeft: '20px', color: '#555' }}>
                {CATEGORIES.map(c => op.scorecard[c.key] !== undefined ? `${c.label}: ${op.scorecard[c.key]}  ` : '').join('')}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={onLeave} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Back to Lobby
      </button>
    </div>
  );
}
