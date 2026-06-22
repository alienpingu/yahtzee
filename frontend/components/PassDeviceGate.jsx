'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useUiStore } from '../lib/store';
import { hueFor } from '../lib/tokens';
import { glassCard, btnPrimary } from './ui.module.css';
import styles from './PassDeviceGate.module.css';

export default function PassDeviceGate({ gameState }) {
  const { passDeviceVisible, hidePassDevice } = useUiStore();

  const currentPlayer = gameState?.players?.find(
    (p) => p.playerId === gameState.currentTurnPlayerId
  );
  const hue = hueFor(currentPlayer);

  return (
    <AnimatePresence>
      {passDeviceVisible && currentPlayer && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className={`${styles.card} ${glassCard}`}
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className={styles.emoji}>📱</div>
            <p className={styles.label}>Pass the device to</p>
            <div className={styles.playerRow}>
              <div
                className={styles.avatar}
                style={{ background: hue.main, boxShadow: `0 0 24px ${hue.soft}66` }}
              >
                {currentPlayer.name.charAt(0).toUpperCase()}
              </div>
              <span className={styles.name}>{currentPlayer.name}</span>
            </div>
            <button
              className={`${styles.readyBtn} ${btnPrimary}`}
              onClick={hidePassDevice}
            >
              I'm Ready
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
