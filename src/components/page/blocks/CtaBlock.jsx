import { useRef } from 'react';
import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { SectionScene } from '../../scenes/SectionScene';
import { Button } from '../../ui/Button';
import { ProximityText } from '../../fx/ProximityText';
import { ArrowLink } from '../../fx/ArrowLink';
import { Reveal } from '@/animation/reveal/Reveal';
import { usePointerField } from '../../../hooks/usePointerField';
import { fx } from '../../../utils/fx';
import styles from './blocks.module.css';

/** Closing band. A soft red light pools under the cursor, the statement answers
 *  the pointer word by word. The conversation lives on the Contact page — no
 *  mailto here. */
export function CtaBlock({ block, accent }) {
  const ref = useRef(null);
  usePointerField(ref);
  const links = block.links || [];
  return (
    <SectionScene
      as="section"
      scene={block.scene || 'signal-wave'}
      intensity="medium"
      accent={accent}
      className={clsx('section', styles.cta)}
    >
      <div ref={ref} className={styles.ctaField} {...fx('cta.pointer-light')}>
        <div className={clsx('container', styles.ctaInner)}>
          <Reveal profile="scanX" as="span" className={clsx('eyebrow', styles.ctaEyebrow)}>
            {block.eyebrow || 'Next'}
          </Reveal>
          <ProximityText as="h2" text={block.title || 'Start a conversation.'} className={clsx('heading-hero', styles.ctaTitle)} />
          <Reveal profile="zoomThrough" as="div" delay={0.1} className={clsx('stack', 'stack-6', styles.ctaBody)}>
            <p className={clsx('lead', styles.ctaLead)}>{block.body || 'For software systems, internal platforms and operational interfaces.'}</p>
            <div className={clsx('cluster', styles.ctaActions)}>
              <Button to="/contact" variant="primary" icon={ArrowUpRight}>Open the contact page</Button>
              {links.map((l) => (
                <ArrowLink key={l.to} to={l.to}>{l.label}</ArrowLink>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </SectionScene>
  );
}

export default CtaBlock;
