'use client';

import { useState, useRef, useEffect } from 'react';
import StartScreen from '../components/StartScreen';
import RulesScreen from '../components/RulesScreen';
import AboutScreen from '../components/AboutScreen';
import Lobby from '../components/Lobby';
import Game from '../components/Game';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

export default function Home() {
  const [view, setView] = useState('start');
  const [player, setPlayer] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const playerNameRef = useRef(null);
  const pendingRef = useRef(null);

  useEffect(() => {
    const name = localStorage.getItem('yatzy_player_name');
    if (name) playerNameRef.current = name;
  }, []);

  const setPlayerSync = (p) => {
    setPlayer(p);
    if (p) {
      playerNameRef.current = p.name;
      localStorage.setItem('yatzy_player_id', p.id);
      localStorage.setItem('yatzy_player_name', p.name);
    } else {
      playerNameRef.current = null;
      localStorage.removeItem('yatzy_player_id');
      localStorage.removeItem('yatzy_player_name');
    }
  };

  useEffect(() => {
    let ws;
    let reconnectTimer;

    const connect = () => {
      ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        setError('');
        if (playerNameRef.current) {
          ws.send(JSON.stringify({ type: 'IDENTIFY', name: playerNameRef.current }));
        }
      };

      ws.onclose = () => {
        setConnected(false);
        reconnectTimer = setTimeout(connect, 1000);
      };

      ws.onmessage = (event) => {
        let data;
        try { data = JSON.parse(event.data); } catch { return; }

        switch (data.type) {
          case 'IDENTIFIED':
            setPlayerSync(data.player);
            const storedGameId = localStorage.getItem('yatzy_game_id');
            if (storedGameId) {
              localStorage.removeItem('yatzy_game_id');
              ws.send(JSON.stringify({ type: 'REJOIN', gameId: Number(storedGameId) }));
            }
            if (pendingRef.current) {
              const { resolve } = pendingRef.current;
              pendingRef.current = null;
              resolve(data.player);
            }
            break;

          case 'STATE':
            setGameState(data.state);
            if (data.state) {
              localStorage.setItem('yatzy_game_id', data.state.id);
            } else {
              localStorage.removeItem('yatzy_game_id');
            }
            break;

          case 'ERROR':
            setError(data.error);
            if (pendingRef.current) {
              const { reject } = pendingRef.current;
              pendingRef.current = null;
              reject(new Error(data.error));
            }
            break;
        }
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      if (ws) ws.close();
    };
  }, []);

  const send = (msg) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      setError('');
      wsRef.current.send(JSON.stringify(msg));
    } else {
      setError('Not connected to server');
    }
  };

  const identify = (name) => {
    return new Promise((resolve, reject) => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        reject(new Error('Not connected to server'));
        return;
      }
      pendingRef.current = { resolve, reject };
      wsRef.current.send(JSON.stringify({ type: 'IDENTIFY', name }));
      setTimeout(() => {
        if (pendingRef.current) {
          pendingRef.current = null;
          reject(new Error('Connection timeout'));
        }
      }, 5000);
    });
  };

  const handleSolo = () => send({ type: 'SOLO', playerId: player.id });
  const handleCreate = () => send({ type: 'CREATE', playerId: player.id });
  const handleJoin = (code) => send({ type: 'JOIN', code, playerId: player.id });
  const handleStart = () => send({ type: 'START', gameId: gameState.id, playerId: player.id });
  const handleRoll = (keep) => send({ type: 'ROLL', gameId: gameState.id, playerId: player.id, keep });
  const handleScore = (category) => send({ type: 'SCORE', gameId: gameState.id, playerId: player.id, category });

  const handleLeave = () => {
    send({ type: 'LEAVE' });
    setGameState(null);
    localStorage.removeItem('yatzy_game_id');
    setError('');
  };

  if (view === 'start') {
    return <StartScreen player={player} onPlay={() => setView('play')} onRules={() => setView('rules')} onAbout={() => setView('about')} onIdentify={identify} />;
  }
  if (view === 'rules') return <RulesScreen onBack={() => setView('start')} />;
  if (view === 'about') return <AboutScreen onBack={() => setView('start')} />;
  if (view === 'play') {
    if (!player) { setView('start'); return null; }
    if (!connected) return <div style={{ padding: '20px' }}>Connecting to server...</div>;
    if (gameState && (gameState.status === 'in_progress' || gameState.status === 'completed')) {
      return <Game gameState={gameState} player={player} onRoll={handleRoll} onScore={handleScore} onLeave={handleLeave} error={error} />;
    }
    return <Lobby player={player} gameState={gameState} error={error} onSolo={handleSolo} onCreate={handleCreate} onJoin={handleJoin} onStart={handleStart} onLeave={handleLeave} />;
  }
  return null;
}
