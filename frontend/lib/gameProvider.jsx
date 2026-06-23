'use client';

import { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Game } from '@shared/gameEngine';
import { useUiStore, useSettings } from './store';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
const HOTSEAT_KEY = 'yatzy_hotseat_state';
const GAME_ID_KEY = 'yatzy_game_id';

const GameContext = createContext(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export function GameProvider({ children }) {
  const [player, setPlayer] = useState(null);
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [mode, setMode] = useState('remote');

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(''), 4000);
    return () => clearTimeout(timer);
  }, [error]);

  const wsRef = useRef(null);
  const playerNameRef = useRef(null);
  const pendingRef = useRef(null);
  const hotseatGameRef = useRef(null);
  const prevScorecardsRef = useRef({});
  const gameIdRef = useRef(null);

  const setPlayerSync = useCallback((p) => {
    setPlayer(p);
    if (p) {
      playerNameRef.current = p.name;
      try {
        localStorage.setItem('yatzy_player_id', String(p.id));
        localStorage.setItem('yatzy_player_name', p.name);
      } catch {}
    } else {
      playerNameRef.current = null;
      try {
        localStorage.removeItem('yatzy_player_id');
        localStorage.removeItem('yatzy_player_name');
      } catch {}
    }
  }, []);

  const detectYatzyEvent = useCallback((state) => {
    if (!state || state.status === 'waiting') return;
    const prev = prevScorecardsRef.current;
    let yatzyPlayer = null;
    for (const p of state.players) {
      const was = prev[p.playerId]?.yatze;
      const now = p.scorecard?.yatze;
      if (was === undefined && now === 50) {
        yatzyPlayer = p;
        break;
      }
    }
    prevScorecardsRef.current = Object.fromEntries(
      state.players.map((p) => [p.playerId, { ...p.scorecard }])
    );
    if (yatzyPlayer) {
      useUiStore.getState().fireYatzy(yatzyPlayer.playerId, yatzyPlayer);
    }
  }, []);

  const applyState = useCallback((state, opts = {}) => {
    setGameState(state);
    if (state) {
      gameIdRef.current = state.id;
      try { localStorage.setItem(GAME_ID_KEY, String(state.id)); } catch {}
      if (opts.detectYatzy !== false) detectYatzyEvent(state);
    } else {
      gameIdRef.current = null;
      try { localStorage.removeItem(GAME_ID_KEY); } catch {}
      prevScorecardsRef.current = {};
    }
  }, [detectYatzyEvent]);

  // ---- WebSocket connection (remote mode) ----
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
          case 'IDENTIFIED': {
            setPlayerSync(data.player);
            const storedGameId = gameIdRef.current || localStorage.getItem(GAME_ID_KEY);
            if (storedGameId) {
              localStorage.removeItem(GAME_ID_KEY);
              ws.send(JSON.stringify({ type: 'REJOIN', gameId: Number(storedGameId) }));
            }
            if (pendingRef.current) {
              const { resolve } = pendingRef.current;
              pendingRef.current = null;
              resolve(data.player);
            }
            break;
          }
          case 'STATE':
            if (data.state?.mode === 'hotseat') return;
            applyState(data.state);
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
  }, [applyState, setPlayerSync]);

  const send = useCallback((msg) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      setError('');
      wsRef.current.send(JSON.stringify(msg));
    } else {
      setError('Not connected to server');
    }
  }, []);

  const identify = useCallback((name) => {
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
  }, []);

  // ---- Hot-seat persistence ----
  const persistHotseat = useCallback(() => {
    const g = hotseatGameRef.current;
    if (!g) return;
    try {
      localStorage.setItem(HOTSEAT_KEY, JSON.stringify(g.toState()));
    } catch {}
  }, []);

  const restoreHotseat = useCallback(() => {
    try {
      const raw = localStorage.getItem(HOTSEAT_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      const g = Game.hydrate(data);
      g.mode = 'hotseat';
      hotseatGameRef.current = g;
      setMode('hotseat');
      applyState(g.toState(), { detectYatzy: false });
      prevScorecardsRef.current = Object.fromEntries(
        g.players.map((p) => [p.playerId, { ...p.scorecard }])
      );
      return true;
    } catch {
      return false;
    }
  }, [applyState]);

  useEffect(() => {
    const name = localStorage.getItem('yatzy_player_name');
    if (name) playerNameRef.current = name;
    restoreHotseat();
  }, [restoreHotseat]);

  // ---- Lobby actions ----
  const solo = useCallback(() => {
    setMode('remote');
    send({ type: 'SOLO', playerId: player.id });
  }, [player, send]);

  const createGame = useCallback(() => {
    setMode('remote');
    send({ type: 'CREATE', playerId: player.id });
  }, [player, send]);

  const joinGame = useCallback((code) => {
    setMode('remote');
    send({ type: 'JOIN', code, playerId: player.id });
  }, [player, send]);

  const startGame = useCallback(() => {
    if (mode === 'hotseat') {
      const g = hotseatGameRef.current;
      if (g) {
        g.start(g.hostPlayerId);
        persistHotseat();
        applyState(g.toState());
      }
      return;
    }
    send({ type: 'START', gameId: gameState.id, playerId: player.id });
  }, [mode, gameState, player, send, persistHotseat, applyState]);

  const startHotseat = useCallback((players) => {
    const game = new Game();
    game.id = 0;
    game.code = 'LOCAL';
    game.mode = 'hotseat';
    let host = null;
    players.forEach((p, i) => {
      const pl = { id: i + 1, name: p.name, hue: p.hue };
      if (i === 0) { host = pl; game.hostPlayerId = pl.id; }
      game.addPlayer(pl);
    });
    hotseatGameRef.current = game;
    setMode('hotseat');
    prevScorecardsRef.current = {};
    persistHotseat();
    applyState(game.toState(), { detectYatzy: false });
  }, [persistHotseat, applyState]);

  const leave = useCallback(() => {
    if (mode === 'hotseat') {
      hotseatGameRef.current = null;
      try { localStorage.removeItem(HOTSEAT_KEY); } catch {}
      setMode('remote');
      applyState(null);
      useUiStore.getState().hidePassDevice();
      useUiStore.getState().setActiveTab(null);
      useUiStore.getState().clearYatzy();
      return;
    }
    send({ type: 'LEAVE' });
    applyState(null);
    setError('');
    useUiStore.getState().hidePassDevice();
    useUiStore.getState().setActiveTab(null);
    useUiStore.getState().clearYatzy();
  }, [mode, send, applyState]);

  // ---- Mode-agnostic dispatch ----
  const dispatch = useCallback((action) => {
    if (mode === 'hotseat') {
      const g = hotseatGameRef.current;
      if (!g) return;
      try {
        if (action.type === 'ROLL') {
          g.roll(g.currentTurnPlayerId, action.keep || []);
        } else if (action.type === 'SCORE') {
          g.score(g.currentTurnPlayerId, action.category);
        }
        persistHotseat();
        applyState(g.toState());
      } catch (e) {
        setError(e.message);
      }
      return;
    }

    // remote / solo
    if (action.type === 'ROLL') {
      send({ type: 'ROLL', gameId: gameState.id, playerId: player.id, keep: action.keep });
    } else if (action.type === 'SCORE') {
      send({ type: 'SCORE', gameId: gameState.id, playerId: player.id, category: action.category });
    }
  }, [mode, gameState, player, send, persistHotseat, applyState]);

  const isMyTurn = useMemo(() => {
    if (!gameState || !player) return false;
    return gameState.currentTurnPlayerId === player.id;
  }, [gameState, player]);

  const value = useMemo(() => ({
    player,
    connected,
    error,
    setError,
    mode,
    gameState,
    isMyTurn,
    identify,
    solo,
    createGame,
    joinGame,
    startGame,
    startHotseat,
    leave,
    dispatch,
  }), [player, connected, error, mode, gameState, isMyTurn, identify, solo, createGame, joinGame, startGame, startHotseat, leave, dispatch]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
