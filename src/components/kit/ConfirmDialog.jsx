import Dialog from './Dialog';
import styles from './overlays.module.css';

/**
 * "Are you sure?" done properly: it says what will happen in the title, the
 * buttons say what they do ("Delete the draft", not "OK"), and for something that
 * cannot be undone the safe choice — Cancel — is the one that has focus.
 */
export default function ConfirmDialog({ open, title, children, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false, onConfirm, onCancel }) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      width="26rem"
      footer={(
        <>
          <button type="button" className={styles.btn} onClick={onCancel} data-autofocus={danger ? '' : undefined}>{cancelLabel}</button>
          <button type="button" className={`${styles.btn} ${danger ? styles.btnDanger : styles.btnPrimary}`} onClick={onConfirm} data-autofocus={danger ? undefined : ''}>{confirmLabel}</button>
        </>
      )}
    >
      {children}
    </Dialog>
  );
}
