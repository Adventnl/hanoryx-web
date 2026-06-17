/* ============================================================
   AUDIO BRIDGE — a single shared snapshot of the live audio spectrum that
   any canvas scene can read without subscribing to the React audio context.

   AudioProvider samples the AnalyserNode once per frame and writes the bytes
   here; scenes call getAudio() in their draw loop. When nothing is playing,
   `active` is false and scenes fall back to procedural idle motion. This keeps
   audio-reactive backgrounds decoupled, allocation-free, and cheap.
   ============================================================ */

const BANDS = 32;

const state = {
  active: false,
  level: 0, // overall loudness 0..1 (smoothed)
  bands: new Float32Array(BANDS), // normalised per-band energy 0..1
};

let levelEMA = 0;

export function setAudioActive(active) {
  state.active = !!active;
  if (!active) {
    levelEMA += (0 - levelEMA) * 0.1;
    state.level = levelEMA;
  }
}

/* Fold raw analyser bytes (any length) into BANDS normalised values. */
export function writeAudioBytes(bytes) {
  if (!bytes || !bytes.length) return;
  const n = bytes.length;
  let sum = 0;
  for (let i = 0; i < BANDS; i += 1) {
    const idx = Math.min(n - 1, Math.floor((i / BANDS) * n));
    const v = bytes[idx] / 255;
    state.bands[i] = v;
    sum += v;
  }
  const inst = sum / BANDS;
  levelEMA += (inst - levelEMA) * 0.18;
  state.level = levelEMA;
  state.active = true;
}

/* Stable reference — scenes read fields each frame. */
export function getAudio() {
  return state;
}

export const AUDIO_BANDS = BANDS;
