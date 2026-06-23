'use client';

import styles from './ConnectionBadge.module.css';

export default function ConnectionBadge() {
  return (
    <div className={styles.badge}>
      <span className={styles.dot} />
      <span className={styles.text}>Reconnecting...</span>
    </div>
  );
}
