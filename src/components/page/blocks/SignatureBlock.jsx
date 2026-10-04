import { Suspense } from 'react';
import { Shell } from './Shell';
import { signatureRegistry } from '../../signatures/registry';
import styles from './blocks.module.css';

/** Hosts a page-specific interactive composition (code-split). It reserves its
 *  height while it loads so the page below never jumps. */
export function SignatureBlock({ block, accent }) {
  const Signature = signatureRegistry[block.kind];
  if (!Signature) return null;
  return (
    <Shell block={{ ...block, intensity: block.intensity || 'low' }} accent={accent}>
      <Suspense fallback={<div className={styles.sigHold} style={{ minHeight: block.minHeight || 480 }} />}>
        <Signature {...block} />
      </Suspense>
    </Shell>
  );
}

export default SignatureBlock;
