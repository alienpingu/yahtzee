import { useMemo } from 'react';

export function useTurnPhase(gameState, isMyTurn) {
  return useMemo(() => {
    if (!gameState) {
      return {
        phase: 'loading',
        diceRolled: false,
        canRoll: false,
        canKeep: false,
        canScore: false,
        rollLabel: 'Roll Dice',
      };
    }

    const inProgress = gameState.status === 'in_progress';
    const diceRolled = !gameState.dice.every((d) => d === 0);
    const rollsLeft = gameState.rollsLeft;

    const phase = gameState.status === 'completed'
      ? 'game_over'
      : rollsLeft === 0
        ? 'must_score'
        : diceRolled
          ? 'rolled'
          : 'turn_start';

    const canRoll = isMyTurn && rollsLeft > 0 && inProgress;
    const canKeep = isMyTurn && rollsLeft < 3 && rollsLeft > 0 && inProgress;
    const canScore = isMyTurn && rollsLeft < 3 && inProgress;

    const rollLabel = rollsLeft === 3
      ? 'Roll Dice'
      : `${rollsLeft} roll${rollsLeft === 1 ? '' : 's'} left`;

    return { phase, diceRolled, canRoll, canKeep, canScore, rollLabel };
  }, [gameState, isMyTurn]);
}
