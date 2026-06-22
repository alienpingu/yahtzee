import { useEffect, useRef } from 'react';
import { useSettings, useUiStore } from './store';

export function useAutofocus(gameState, mode) {
  const { autofocusOn } = useSettings();
  const { setActiveTab, showPassDevice } = useUiStore();
  const prevTurnId = useRef(gameState?.currentTurnPlayerId);
  const didInit = useRef(false);

  useEffect(() => {
    if (!gameState || gameState.status === 'waiting') return;

    const turnId = gameState.currentTurnPlayerId;

    if (!didInit.current) {
      didInit.current = true;
      prevTurnId.current = turnId;

      if (mode === 'hotseat' && autofocusOn && gameState.rollsLeft === 3) {
        setActiveTab(turnId);
        showPassDevice();
      } else if (autofocusOn) {
        setActiveTab(turnId);
      }
      return;
    }

    if (turnId !== prevTurnId.current) {
      prevTurnId.current = turnId;

      if (autofocusOn) {
        setActiveTab(turnId);
      }

      if (mode === 'hotseat' && autofocusOn) {
        showPassDevice();
      }
    }
  }, [gameState?.currentTurnPlayerId, gameState?.status, gameState?.rollsLeft, mode, autofocusOn, setActiveTab, showPassDevice]);
}
