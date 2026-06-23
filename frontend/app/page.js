'use client';

import { useState, useEffect } from 'react';
import StartScreen from '../components/StartScreen';
import RulesScreen from '../components/RulesScreen';
import AboutScreen from '../components/AboutScreen';
import Lobby from '../components/Lobby';
import GameScreen from '../components/GameScreen';
import { GameProvider, useGame } from '../lib/gameProvider';
import ConnectionBadge from '../components/ConnectionBadge';

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

  let content;
  if (view === 'start') {
    content = (
      <StartScreen
        player={player}
        onPlay={() => setView('play')}
        onRules={() => setView('rules')}
        onAbout={() => setView('about')}
        onIdentify={identify}
      />
    );
  } else if (view === 'rules') {
    content = <RulesScreen onBack={() => setView('start')} />;
  } else if (view === 'about') {
    content = <AboutScreen onBack={() => setView('start')} />;
  } else if (view === 'play') {
    if (mode === 'remote' && !player) {
      setView('start');
      content = null;
    } else if (gameState && (gameState.status === 'in_progress' || gameState.status === 'completed')) {
      content = (
        <GameScreen
          gameState={gameState}
          player={player}
          mode={mode}
          onRoll={(keep) => dispatch({ type: 'ROLL', keep })}
          onScore={(category) => dispatch({ type: 'SCORE', category })}
          onLeave={leave}
          error={error}
        />
      );
    } else {
      content = (
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
  }

  return (
    <>
      {content}
      {mode === 'remote' && !connected && <ConnectionBadge />}
    </>
  );
}

export default function Home() {
  return (
    <GameProvider>
      <HomeInner />
    </GameProvider>
  );
}
