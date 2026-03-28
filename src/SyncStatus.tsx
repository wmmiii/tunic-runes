import { User } from 'firebase/auth';
import { isConfigured } from './firebase';
import styles from './SyncStatus.module.css';

export type SyncState = 'idle' | 'syncing' | 'synced' | 'error';

interface Props {
  user: User | null;
  syncState: SyncState;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function SyncStatus({ user, syncState, onSignIn, onSignOut }: Props) {
  if (!isConfigured) return null;

  if (!user) {
    return (
      <button className={styles.signInButton} onClick={onSignIn}>
        Sign in to sync
      </button>
    );
  }

  const indicator =
    syncState === 'syncing' ? '⟳' : syncState === 'error' ? '✕' : '✓';
  const indicatorClass =
    syncState === 'syncing'
      ? styles.spinning
      : syncState === 'error'
        ? styles.error
        : styles.synced;

  return (
    <div className={styles.wrapper}>
      <span className={`${styles.indicator} ${indicatorClass}`}>{indicator}</span>
      <span className={styles.displayName}>{user.displayName ?? user.email}</span>
      <button className={styles.signOutButton} onClick={onSignOut}>
        Sign out
      </button>
    </div>
  );
}

