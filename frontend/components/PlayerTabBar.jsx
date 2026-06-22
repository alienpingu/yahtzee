'use client';

import { useEffect, useRef } from 'react';
import { hueFor } from '../lib/tokens';
import { useUiStore } from '../lib/store';
import styles from './PlayerTabBar.module.css';

export default function PlayerTabBar({ gameState, viewerPlayerId }) {
  const { activeTabId, setActiveTab } = useUiStore();
  const tabRefs = useRef({});

  const activeTurnId = gameState.currentTurnPlayerId;

  useEffect(() => {
    if (activeTabId == null && gameState.players.length > 0) {
      const viewer = gameState.players.find((p) => p.playerId === viewerPlayerId);
      setActiveTab(viewer ? viewer.playerId : gameState.players[0].playerId);
    }
  }, [gameState.players, viewerPlayerId, activeTabId, setActiveTab]);

  useEffect(() => {
    const ref = tabRefs.current[activeTurnId];
    if (ref) ref.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeTurnId]);

  return (
    <div className={styles.bar}>
      <div className={styles.scroll}>
        {gameState.players.map((p) => (
          <PlayerTab
            key={p.playerId}
            ref={(el) => { tabRefs.current[p.playerId] = el; }}
            player={p}
            isTurn={p.playerId === activeTurnId}
            isViewer={p.playerId === viewerPlayerId}
            isActiveTab={p.playerId === activeTabId}
            onClick={() => setActiveTab(p.playerId)}
          />
        ))}
      </div>
    </div>
  );
}

function PlayerTab({ player, isTurn, isViewer, isActiveTab, onClick, ref }) {
  const hue = hueFor(player);
  return (
    <button
      ref={ref}
      className={`${styles.tab} ${isActiveTab ? styles.tabActive : ''} ${isTurn ? styles.tabTurn : ''}`}
      onClick={onClick}
      style={{
        '--hue': hue.main,
        '--hue-soft': hue.soft + '99',
      }}
    >
      <div className={styles.avatar} style={{ background: hue.main }}>
        {player.name.charAt(0).toUpperCase()}
        {isTurn && <span className={styles.turnDot} />}
      </div>
      <div className={styles.info}>
        <span className={styles.name}>
          {player.name}
          {isViewer && <span className={styles.youTag}>You</span>}
        </span>
        <span className={styles.score}>{player.totalScore} pts</span>
      </div>
    </button>
  );
}
