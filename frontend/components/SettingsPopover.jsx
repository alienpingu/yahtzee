'use client';

import { useState } from 'react';
import { useSettings } from '../lib/store';
import styles from './SettingsPopover.module.css';
import { glassCard } from './ui.module.css';

export default function SettingsPopover({ onClose }) {
  const { autofocusOn, soundOn, reduceMotion, setAutofocus, setSound, setReduceMotion } = useSettings();

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={`${styles.popover} ${glassCard}`}>
        <div className={styles.header}>
          <span className={styles.title}>Settings</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className={styles.body}>
          <Toggle label="Autofocus tab" desc="Switch to active player's tab" checked={autofocusOn} onChange={setAutofocus} />
          <Toggle label="Sound" desc="Dice & celebration effects" checked={soundOn} onChange={setSound} />
          <Toggle label="Reduce motion" desc="Minimize animations" checked={reduceMotion} onChange={setReduceMotion} />
        </div>
      </div>
    </>
  );
}

function Toggle({ label, desc, checked, onChange }) {
  return (
    <label className={styles.row}>
      <div className={styles.rowText}>
        <span className={styles.rowLabel}>{label}</span>
        <span className={styles.rowDesc}>{desc}</span>
      </div>
      <button
        type="button"
        className={`${styles.switch} ${checked ? styles.switchOn : ''}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
      >
        <span className={styles.knob} />
      </button>
    </label>
  );
}
