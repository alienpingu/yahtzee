'use client';

import { useState, useEffect } from 'react';
import StartScreen from '../components/StartScreen';
import RulesScreen from '../components/RulesScreen';
import AboutScreen from '../components/AboutScreen';
import Lobby from '../components/Lobby';
import Game from '../components/Game';
import { GameProvider, useGame } from '../lib/gameProvider';

function HomeInner() {
  const {
    player, connected, error, gameState, mode,
    identify, solo, createGame, joinGame, startGame,
    startHotseat, leave, dispatch,
  } = useGame();
  const [view, setView] = useState('start');

  useEffect(() => {
    if (gameState && (gameState.status === 'in_progress' || gameState.status === 'completed')) {
      setView('play');
    }
  }, [gameState?.status]);

  if (view === 'start') {
    return (
      <StartScreen
        player={player}
        onPlay={() => setView('play')}
        onRules={() => setView('rules')}
        onAbout={() => setView('about')}
        onIdentify={identify}
      />
    );
  }
  if (view === 'rules') return <RulesScreen onBack={() => setView('start')} />;
  if (view === 'about') return <AboutScreen onBack={() => setView('start')} />;
  if (view === 'play') {
    if (mode === 'remote' && !player) { setView('start'); return null; }
    if (mode === 'remote' && !connected) {
      return <div style={{ padding: '20px' }}>Connecting to server...</div>;
    }
    if (gameState && (gameState.status === 'in_progress' || gameState.status === 'completed')) {
      return (
        <Game
          gameState={gameState}
          player={player}
          mode={mode}
          onRoll={(keep) => dispatch({ type: 'ROLL', keep })}
          onScore={(category) => dispatch({ type: 'SCORE', category })}
          onLeave={leave}
          error={error}
        />
      );
    }
    return (
      <Lobby
        player={player}
        gameState={gameState}
        error={error}
        onSolo={solo}
        onCreate={createGame}
        onJoin={joinGame}
        onStart={startGame}
        onHotseat={startHotseat}
        onLeave={leave}
      />
    );
  }
  return null;
}

export default function Home() {
  return (
    <GameProvider>
      <HomeInner />
    </GameProvider>
  );
}
