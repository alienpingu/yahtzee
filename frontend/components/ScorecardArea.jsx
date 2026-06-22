'use client';

import { CATEGORIES, CATEGORY_META, calculateScore } from '@shared/gameEngine';
import { hueFor } from '../lib/tokens';
import { useUiStore } from '../lib/store';
import styles from './ScorecardArea.module.css';
import { glassCard } from './ui.module.css';

export default function ScorecardArea({ gameState, viewerPlayerId, canScore, diceRolled, onScore }) {
  const { activeTabId } = useUiStore();

  const activePlayer = gameState.players.find((p) => p.playerId === activeTabId) || gameState.players[0];
  const opponents = gameState.players.filter((p) => p.playerId !== activePlayer?.playerId);

  return (
    <div className={styles.area}>
      <div className={`${styles.activeCard} ${glassCard}`}>
        <div className={styles.activeHeader}>
          <div className={styles.activeAvatar} style={{ background: hueFor(activePlayer).main }}>
            {activePlayer?.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.activeInfo}>
            <span className={styles.activeName}>{activePlayer?.name}</span>
            <span className={styles.activeTotal}>{activePlayer?.totalScore} points</span>
          </div>
        </div>

        <div className={styles.sections}>
          <CategorySection
            title="Upper"
            cats={CATEGORIES.filter((c) => CATEGORY_META[c].section === 'upper')}
            activePlayer={activePlayer}
            canScore={canScore}
            diceRolled={diceRolled}
            dice={gameState.dice}
            isOwnCard={activePlayer?.playerId === viewerPlayerId}
            onScore={onScore}
          />
          <CategorySection
            title="Lower"
            cats={CATEGORIES.filter((c) => CATEGORY_META[c].section === 'lower')}
            activePlayer={activePlayer}
            canScore={canScore}
            diceRolled={diceRolled}
            dice={gameState.dice}
            isOwnCard={activePlayer?.playerId === viewerPlayerId}
            onScore={onScore}
          />
        </div>
      </div>

      {opponents.length > 0 && (
        <div className={styles.opponents}>
          {opponents.map((op) => {
            const hue = hueFor(op);
            const filled = Object.keys(op.scorecard).length;
            return (
              <div key={op.playerId} className={`${styles.oppCard} ${glassCard}`}>
                <div className={styles.oppAvatar} style={{ background: hue.main }}>
                  {op.name.charAt(0).toUpperCase()}
                </div>
                <div className={styles.oppInfo}>
                  <span className={styles.oppName}>{op.name}</span>
                  <span className={styles.oppProgress}>{filled}/13 filled</span>
                </div>
                <span className={styles.oppScore} style={{ color: hue.soft }}>{op.totalScore}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CategorySection({ title, cats, activePlayer, canScore, diceRolled, dice, isOwnCard, onScore }) {
  return (
    <div className={styles.section}>
      <span className={styles.sectionLabel}>{title}</span>
      <div className={styles.catList}>
        {cats.map((cat) => {
          const meta = CATEGORY_META[cat];
          const scored = activePlayer?.scorecard[cat] !== undefined;
          const points = scored ? activePlayer.scorecard[cat] : null;
          const preview = !scored && diceRolled ? calculateScore(cat, dice) : null;
          const interactive = canScore && isOwnCard && !scored;

          return (
            <button
              key={cat}
              className={`${styles.catRow} ${scored ? styles.catScored : ''} ${interactive ? styles.catInteractive : ''} ${preview > 0 ? styles.catPreviewGood : ''} ${preview === 0 ? styles.catPreviewZero : ''}`}
              onClick={() => interactive && onScore(cat)}
              disabled={!interactive}
            >
              <span className={styles.catLabel}>{meta.label}</span>
              <span className={styles.catValue}>
                {scored ? points : preview !== null ? preview : '–'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
