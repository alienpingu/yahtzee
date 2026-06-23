'use client';

import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useUiStore, useSettings } from '../../lib/store';
import { hueFor } from '../../lib/tokens';
import styles from './CelebrationOverlay.module.css';

const CelebrationCanvas = dynamic(() => import('./CelebrationCanvas'), {
  ssr: false,
});

const CELEBRATION_DURATION = 2500;

export default function CelebrationOverlay() {
  const { lastYatzyEvent, clearYatzy } = useUiStore();
  const { reduceMotion } = useSettings();
  const [visible, setVisible] = useState(false);
  const lastTsRef = useRef(null);
  const dismissTimerRef = useRef(null);

  useEffect(() => {
    if (!lastYatzyEvent || lastYatzyEvent.ts === lastTsRef.current) return;

    lastTsRef.current = lastYatzyEvent.ts;
    setVisible(true);

    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => {
      setVisible(false);
      clearYatzy();
    }, CELEBRATION_DURATION);

    return () => {
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    };
  }, [lastYatzyEvent, clearYatzy]);

  const dismiss = () => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    setVisible(false);
    clearYatzy();
  };

  const player = lastYatzyEvent?.player;
  const hue = hueFor(player);

  return (
    <AnimatePresence>
      {visible && player && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={dismiss}
        >
          {!reduceMotion && (
            <div className={styles.canvasLayer}>
              <CelebrationCanvas />
            </div>
          )}

          <div className={styles.textLayer}>
            <motion.div
              className={styles.textWrap}
              initial={{ scale: 0, rotateX: -40, opacity: 0 }}
              animate={{ scale: [0, 1.15, 1], rotateX: [-40, 5, 0], opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ transformPerspective: 600 }}
            >
              <h1 className={styles.yatzyText}>YATZY!</h1>
            </motion.div>

            <motion.div
              className={styles.playerLine}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className={styles.avatar} style={{ background: hue.main }}>
                {player.name.charAt(0).toUpperCase()}
              </div>
              <span className={styles.scoredBy}>
                <strong>{player.name}</strong> scored a Yatzy!
              </span>
              <span className={styles.emoji}>🎉</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
