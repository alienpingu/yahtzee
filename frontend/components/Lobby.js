'use client';

import { useState } from 'react';
import { PLAYER_HUES } from '@shared/gameEngine';
import { hueFor } from '../lib/tokens';
import styles from './Lobby.module.css';
import { btnPrimary, btnGhost, btnDanger, glassCard, input, screen, titleGradient, error as errStyle } from './ui.module.css';

export default function Lobby({ player, gameState, error, onSolo, onCreate, onJoin, onStart, onHotseat, onLeave }) {
  const [joinCode, setJoinCode] = useState('');
  const [showHotseat, setShowHotseat] = useState(false);
  const [hsPlayers, setHsPlayers] = useState([
    { name: '', hue: PLAYER_HUES[0].id },
    { name: '', hue: PLAYER_HUES[1].id },
  ]);

  if (gameState) {
    const isHost = gameState.hostPlayerId === player?.id || gameState.mode === 'hotseat';
    return (
      <div className={screen}>
        <h1 className={`${styles.title} ${titleGradient}`}>Waiting Room</h1>

        <div className={`${styles.codeCard} ${glassCard}`}>
          <span className={styles.codeLabel}>Game Code</span>
          <span className={styles.code}>{gameState.code}</span>
          {gameState.mode !== 'hotseat' && (
            <span className={styles.codeHint}>Share this code with friends</span>
          )}
        </div>

        <div className={`${styles.playersCard} ${glassCard}`}>
          <h2 className={styles.sectionTitle}>
            Players <span className={styles.playerCount}>{gameState.players.length}/4</span>
          </h2>
          <div className={styles.playerList}>
            {gameState.players.map((p) => {
              const hue = hueFor(p);
              return (
                <div key={p.playerId} className={styles.playerRow}>
                  <div className={styles.avatar} style={{ background: hue.main }}>
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <span className={styles.playerName}>{p.name}</span>
                  {p.playerId === gameState.hostPlayerId && <span className={styles.badge}>Host</span>}
                  {p.playerId === player?.id && <span className={styles.badgeYou}>You</span>}
                </div>
              );
            })}
          </div>
        </div>

        {error && <p className={errStyle}>{error}</p>}

        <div className={styles.actions}>
          {isHost ? (
            <button className={btnPrimary} onClick={onStart} disabled={gameState.players.length < 1}>
              Start Game
            </button>
          ) : (
            <p className={styles.waiting}>Waiting for host to start...</p>
          )}
          <button className={btnDanger} onClick={onLeave}>Leave</button>
        </div>
      </div>
    );
  }

  if (showHotseat) {
    return (
      <HotseatSetup
        hsPlayers={hsPlayers}
        setHsPlayers={setHsPlayers}
        onStart={onHotseat}
        onBack={() => setShowHotseat(false)}
        error={error}
      />
    );
  }

  return (
    <div className={screen}>
      <h1 className={`${styles.title} ${titleGradient}`}>Lobby</h1>
      {player && <p className={styles.welcome}>Welcome, <strong>{player.name}</strong>!</p>}

      {error && <p className={errStyle}>{error}</p>}

      <div className={styles.cardGrid}>
        <button className={`${styles.modeCard} ${glassCard}`} onClick={onSolo}>
          <span className={styles.modeIcon}>🎯</span>
          <span className={styles.modeTitle}>Single Player</span>
          <span className={styles.modeDesc}>Practice against yourself</span>
        </button>

        <button className={`${styles.modeCard} ${glassCard}`} onClick={onCreate}>
          <span className={styles.modeIcon}>🌐</span>
          <span className={styles.modeTitle}>Create Multiplayer</span>
          <span className={styles.modeDesc}>Invite friends with a code</span>
        </button>

        <button className={`${styles.modeCard} ${glassCard}`} onClick={() => setShowHotseat(true)}>
          <span className={styles.modeIcon}>📱</span>
          <span className={styles.modeTitle}>Hot-Seat</span>
          <span className={styles.modeDesc}>Pass-and-play, 2–4 players</span>
        </button>
      </div>

      <div className={`${styles.joinCard} ${glassCard}`}>
        <span className={styles.joinTitle}>Join with code</span>
        <div className={styles.joinRow}>
          <input
            type="text"
            className={input}
            placeholder="CODE"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 4))}
            onKeyDown={(e) => { if (e.key === 'Enter' && joinCode.length === 4) onJoin(joinCode); }}
          />
          <button className={btnPrimary} onClick={() => onJoin(joinCode)} disabled={joinCode.length !== 4}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

function HotseatSetup({ hsPlayers, setHsPlayers, onStart, onBack, error }) {
  const canStart = hsPlayers.every((p) => p.name.trim().length > 0);

  const updatePlayer = (i, field, value) => {
    setHsPlayers((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: value } : p));
  };

  const addPlayer = () => {
    if (hsPlayers.length >= 4) return;
    const usedHues = hsPlayers.map((p) => p.hue);
    const nextHue = PLAYER_HUES.find((h) => !usedHues.includes(h.id)) || PLAYER_HUES[hsPlayers.length];
    setHsPlayers([...hsPlayers, { name: '', hue: nextHue.id }]);
  };

  const removePlayer = (i) => {
    setHsPlayers((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleStart = () => {
    onStart(hsPlayers.map((p) => ({ name: p.name.trim(), hue: p.hue })));
  };

  return (
    <div className={screen}>
      <h1 className={`${styles.title} ${titleGradient}`}>Hot-Seat Setup</h1>
      <p className={styles.welcome}>Add 2–4 players. Pass the device between turns.</p>

      {error && <p className={errStyle}>{error}</p>}

      <div className={styles.hsList}>
        {hsPlayers.map((p, i) => {
          const hue = PLAYER_HUES.find((h) => h.id === p.hue) || PLAYER_HUES[0];
          return (
            <div key={i} className={`${styles.hsRow} ${glassCard}`}>
              <div className={styles.avatar} style={{ background: hue.main }}>
                {i + 1}
              </div>
              <input
                type="text"
                className={input}
                placeholder={`Player ${i + 1} name`}
                value={p.name}
                onChange={(e) => updatePlayer(i, 'name', e.target.value)}
              />
              <div className={styles.huePicker}>
                {PLAYER_HUES.map((h) => (
                  <button
                    key={h.id}
                    className={`${styles.hueSwatch} ${p.hue === h.id ? styles.hueSwatchActive : ''}`}
                    style={{ background: h.main }}
                    onClick={() => updatePlayer(i, 'hue', h.id)}
                    aria-label={h.name}
                  />
                ))}
              </div>
              {hsPlayers.length > 2 && (
                <button className={styles.removeBtn} onClick={() => removePlayer(i)} aria-label="Remove">✕</button>
              )}
            </div>
          );
        })}
      </div>

      {hsPlayers.length < 4 && (
        <button className={btnGhost} onClick={addPlayer}>+ Add Player</button>
      )}

      <div className={styles.actions}>
        <button className={btnPrimary} onClick={handleStart} disabled={!canStart}>Start Game</button>
        <button className={btnGhost} onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
