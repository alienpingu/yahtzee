'use client';

import { useState } from 'react';

export default function Lobby({ player, gameState, error, onSolo, onCreate, onJoin, onStart, onLeave }) {
  const [joinCode, setJoinCode] = useState('');

  if (!gameState) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Lobby</h1>
        <p>Welcome, {player?.name}!</p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ margin: '20px 0' }}>
          <button onClick={onSolo} style={{ padding: '10px 20px', margin: '5px' }}>
            Single player
          </button>
        </div>

        <div style={{ margin: '20px 0' }}>
          <button onClick={onCreate} style={{ padding: '10px 20px', margin: '5px' }}>
            Create multiplayer game
          </button>
        </div>

        <div style={{ margin: '20px 0' }}>
          <input
            type="text"
            placeholder="CODE"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 4))}
            style={{ padding: '10px', fontSize: '16px', marginRight: '10px', width: '120px' }}
          />
          <button
            onClick={() => joinCode.length === 4 && onJoin(joinCode)}
            disabled={joinCode.length !== 4}
            style={{ padding: '10px 20px', margin: '5px' }}
          >
            Join game
          </button>
        </div>
      </div>
    );
  }

  const isHost = gameState.hostPlayerId === player.id;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Waiting Room</h1>

      <p>Game code: <strong style={{ fontSize: '24px' }}>{gameState.code}</strong></p>
      <p>Share this code with others so they can join.</p>

      <h2>Players ({gameState.players.length}/4)</h2>
      <div>
        {gameState.players.map(p => (
          <div key={p.playerId} style={{ margin: '5px 0', fontSize: '16px' }}>
            {p.name}
            {p.playerId === gameState.hostPlayerId && ' (host)'}
            {p.playerId === player.id && ' (you)'}
          </div>
        ))}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {isHost ? (
        <button
          onClick={onStart}
          disabled={gameState.players.length < 1}
          style={{ padding: '10px 20px', margin: '5px' }}
        >
          Start game
        </button>
      ) : (
        <p>Waiting for host to start the game...</p>
      )}

      <button onClick={onLeave} style={{ padding: '10px 20px', margin: '5px' }}>
        Leave
      </button>
    </div>
  );
}
