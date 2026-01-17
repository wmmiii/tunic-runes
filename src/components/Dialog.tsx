import { Dialog as BaseDialog } from '@base-ui/react';
import styles from './Dialog.module.css';

export function Dialog() {
  return (
    <BaseDialog.Root open={true}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Popup className={styles.popup}>
          <BaseDialog.Description className={styles.description}>
            You are all caught up. Good job!
          </BaseDialog.Description>
          <div className={styles.actions}>
            <BaseDialog.Close className={styles.button}>Close</BaseDialog.Close>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
