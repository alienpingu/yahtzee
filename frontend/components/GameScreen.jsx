'use client';

import { useState, useEffect } from 'react';
import GameTopBar from './GameTopBar';
import PlayerTabBar from './PlayerTabBar';
import ScorecardArea from './ScorecardArea';
import DiceStage from './DiceStage';
import { hueFor } from '../lib/tokens';
import styles from './GameScreen.module.css';
import { glassCard, btnPrimary, titleGradient, error as errStyle } from './ui.module.css';

export default function GameScreen({ gameState, player, mode, onRoll, onScore, onLeave, error }) {
  const [kept, setKept] = useState([]);

  useEffect(() => {
    if (gameState && gameState.rollsLeft === 3) setKept([]);
  }, [gameState?.rollsLeft]);

  if (!gameState) return <div className={styles.connecting}>Connecting...</div>;

  const isMyTurn = mode === 'hotseat' || gameState.currentTurnPlayerId === player?.id;
  const gameComplete = gameState.status === 'completed';
  const currentTurnPlayer = gameState.players.find((p) => p.playerId === gameState.currentTurnPlayerId);
  const winner = gameState.players.find((p) => p.playerId === gameState.winnerPlayerId);

  const toggleKeep = (index) => {
    setKept((prev) => prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]);
  };

  const handleScore = (category) => {
    onScore(category);
    setKept([]);
  };

  const handleRoll = () => {
    onRoll(kept);
  };

  return (
    <div className={styles.screen}>
      <GameTopBar gameState={gameState} onLeave={onLeave} />

      <PlayerTabBar gameState={gameState} viewerPlayerId={mode === 'hotseat' ? currentTurnPlayer?.playerId : player?.id} />

      <ScorecardArea
        gameState={gameState}
        viewerPlayerId={mode === 'hotseat' ? currentTurnPlayer?.playerId : player?.id}
        isMyTurn={isMyTurn}
        mode={mode}
        onScore={handleScore}
      />

      <DiceStage
        gameState={gameState}
        isMyTurn={isMyTurn}
        kept={kept}
        onToggleKeep={toggleKeep}
        onRoll={handleRoll}
      />

      {!gameComplete && !isMyTurn && (
        <div className={styles.turnBanner}>
          <div className={styles.turnAvatar} style={{ background: hueFor(currentTurnPlayer).main }}>
            {currentTurnPlayer?.name.charAt(0).toUpperCase()}
          </div>
          <span>{currentTurnPlayer?.name}'s turn</span>
        </div>
      )}

      {error && <p className={`${styles.errorFloating} ${errStyle}`}>{error}</p>}

      {gameComplete && (
        <div className={styles.gameOverOverlay}>
          <div className={`${styles.gameOverCard} ${glassCard}`}>
            <span className={styles.gameOverEmoji}>🏆</span>
            <h2 className={`${styles.gameOverTitle} ${titleGradient}`}>Game Over!</h2>
            <p className={styles.gameOverWinner}>
              {winner?.name} wins with {winner?.totalScore} points!
            </p>
            <div className={styles.gameOverRankings}>
              {[...gameState.players].sort((a, b) => b.totalScore - a.totalScore).map((p, i) => (
                <div key={p.playerId} className={styles.rankRow}>
                  <span className={styles.rankNum}>{i + 1}</span>
                  <span className={styles.rankName}>{p.name}</span>
                  <span className={styles.rankScore}>{p.totalScore}</span>
                </div>
              ))}
            </div>
            <button className={btnPrimary} onClick={onLeave}>Back to Lobby</button>
          </div>
        </div>
      )}
    </div>
  );
}
