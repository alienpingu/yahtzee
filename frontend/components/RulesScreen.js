'use client';

import styles from './RulesScreen.module.css';
import { btnGhost, glassCard, screen, titleGradient } from './ui.module.css';

export default function RulesScreen({ onBack }) {
  return (
    <div className={screen}>
      <h1 className={`${styles.title} ${titleGradient}`}>How to Play</h1>

      <div className={`${styles.card} ${glassCard}`}>
        <h2 className={styles.sectionTitle}>Gameplay</h2>
        <ol className={styles.list}>
          <li>Click <strong>Roll</strong> to roll all 5 dice.</li>
          <li>Tap dice to <strong>keep</strong> them (they lock in place).</li>
          <li>Roll again (up to <strong>3 times</strong> total per turn).</li>
          <li>Choose a <strong>scoring category</strong> to end your turn.</li>
          <li>Complete all 13 categories to finish the game.</li>
        </ol>
      </div>

      <div className={`${styles.card} ${glassCard}`}>
        <h2 className={styles.sectionTitle}>Scoring</h2>
        <ul className={styles.list}>
          <li><strong>Ones–Sixes</strong>: Sum of matching dice.</li>
          <li><strong>Three of a Kind</strong>: Sum of all dice if 3+ match.</li>
          <li><strong>Four of a Kind</strong>: Sum of all dice if 4+ match.</li>
          <li><strong>Full House</strong>: 25 points (3 + 2).</li>
          <li><strong>Small Straight</strong>: 30 points (4 consecutive).</li>
          <li><strong>Large Straight</strong>: 40 points (5 consecutive).</li>
          <li><strong>Yatzy</strong>: 50 points (all 5 dice the same).</li>
          <li><strong>Chance</strong>: Sum of all dice.</li>
        </ul>
      </div>

      <div className={`${styles.card} ${glassCard}`}>
        <h2 className={styles.sectionTitle}>Multiplayer</h2>
        <ul className={styles.list}>
          <li>Create a game and share the 4-character code.</li>
          <li>2 to 4 players per game.</li>
          <li>Players take turns in strict order.</li>
          <li>Highest total score after 13 rounds wins.</li>
        </ul>
      </div>

      <button className={btnGhost} onClick={onBack}>Back</button>
    </div>
  );
}
