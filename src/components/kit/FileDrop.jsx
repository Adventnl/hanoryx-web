import { useId, useState } from 'react';
import { Upload } from 'lucide-react';
import styles from './inputs.module.css';

const size = (bytes) => (bytes < 1024 ? `${bytes} B` : bytes < 1048576 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / 1048576).toFixed(1)} MB`);

/**
 * A drop zone that is also a file button: drag files onto it, or press it and
 * choose. It lists what was picked and hands the files to `onFiles` — it uploads
 * nothing itself, and on this site nothing is sent anywhere.
 */
export default function FileDrop({ label = 'Choose files', hint = 'or drop them here', accept, multiple = true, onFiles, className }) {
  const id = useId();
  const [over, setOver] = useState(false);
  const [files, setFiles] = useState([]);
  const take = (list) => {
    const picked = Array.from(list || []);
    setFiles(picked);
    onFiles?.(picked);
  };

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={styles.drop}
        data-over={over ? '' : undefined}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files); }}
      >
        <Upload size={22} strokeWidth={1.4} aria-hidden="true" />
        <b>{label}</b>
        <span>{hint}</span>
        <input id={id} type="file" accept={accept} multiple={multiple} onChange={(e) => take(e.target.files)} />
      </label>
      <ul className={styles.files} aria-label="Chosen files" aria-live="polite">
        {files.map((f) => <li key={`${f.name}-${f.size}`}><span>{f.name}</span><span>{size(f.size)}</span></li>)}
      </ul>
    </div>
  );
}
