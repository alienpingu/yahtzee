'use client';

import { useState } from 'react';

export default function StartScreen({ player, onPlay, onRules, onAbout, onIdentify }) {
  const [name, setName] = useState('');
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePlay = async () => {
    if (player) { onPlay(); return; }
    if (!asking) { setAsking(true); return; }
    if (!name.trim()) { setError('Name required'); return; }
    try {
      setError('');
      setLoading(true);
      await onIdentify(name.trim());
      onPlay();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Yatze Game</h1>

      {player && <p>Welcome, {player.name}!</p>}

      {asking && !player && (
        <div style={{ margin: '20px 0' }}>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handlePlay(); }}
            style={{ padding: '10px', fontSize: '16px', marginRight: '10px', width: '200px' }}
          />
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <button onClick={handlePlay} disabled={loading} style={{ padding: '10px 20px', margin: '5px' }}>
          {loading ? 'Loading...' : asking && !player ? 'Submit' : 'Play'}
        </button>
        <button onClick={onRules} style={{ padding: '10px 20px', margin: '5px' }}>
          Rules
        </button>
        <button onClick={onAbout} style={{ padding: '10px 20px', margin: '5px' }}>
          About
        </button>
      </div>
    </div>
  );
}
