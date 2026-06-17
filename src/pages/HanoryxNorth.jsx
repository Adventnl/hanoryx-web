import clsx from 'clsx';
import { ArrowDownRight, GitBranch, Workflow, Boxes } from 'lucide-react';

import { PageTransition } from '../components/layout/PageTransition';
import { PageHero } from '../components/ui/PageHero';
import { SectionHeader } from '../components/ui/SectionHeader';
import { DataPanel } from '../components/ui/DataPanel';
import { Pill } from '../components/ui/Pill';
import { GlitchLine } from '../components/ui/GlitchLine';
import { ScrollReveal } from '../components/animation/ScrollReveal';
import { SystemGrid } from '../components/animation/SystemGrid';
import { KineticText } from '../components/animation/KineticText';

import { OperatingPrinciples } from '../components/sections/OperatingPrinciples';
import { CapabilitiesMatrix } from '../components/sections/CapabilitiesMatrix';
import { ArchitectureShowcase } from '../components/sections/ArchitectureShowcase';
import { ContactSection } from '../components/sections/ContactSection';

import { north } from '../data/company';
import {
  engineeringPrinciples,
  designApproach,
  stack,
  interfaceLanguage,
} from '../data/capabilities';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

import styles from './HanoryxNorth.module.css';

/* Pairs a faint line-icon with each pillar — kept in-file, never exported. */
const PILLAR_ICONS = [Boxes, Workflow, GitBranch];

/**
 * Hanoryx North — the engineering division.
 * Cinematic hero, a mission ledger, engineering doctrine, a staged design
 * approach, the capabilities matrix, a motion-philosophy field, the platform
 * architecture, and an interface "lab" before the closing contact band.
 * Pure composition of the existing library with a handful of page-local blocks.
 */
export function HanoryxNorth() {
  useDocumentTitle('Hanoryx North');

  return (
    <PageTransition>
      {/* 1 — HERO ------------------------------------------------------- */}
      <PageHero
        eyebrow={north.eyebrow}
        title="The engineering division behind Hanoryx Systems."
        intro={north.lead}
        code="NODE.NORTH"
        status="ACTIVE"
      />

      {/* 2 — MISSION (page-local ledger) ------------------------------- */}
      <section className={clsx('section', styles.mission)}>
        <span className={styles.rail} aria-hidden="true" />

        <div className="container">
          <div className={clsx('grid', 'grid--split', styles.missionSplit)}>
            {/* LEFT — framing */}
            <div className={styles.missionLead}>
              <SectionHeader
                eyebrow="North // Mandate"
                title={north.mission.title}
                code="N.MISSION"
                size="h1"
              />

              <ScrollReveal as="div" className={clsx('stack', 'stack-5', styles.missionBody)}>
                {north.mission.body.map((line, i) => (
                  <p key={i} className={clsx('lead', styles.missionLine)}>
                    {line}
                  </p>
                ))}
              </ScrollReveal>

              <GlitchLine className={styles.missionAccent} />

              <p className={clsx('mono', 'text-faint', styles.missionLegend)}>
                ARCH / IFACE / ORCH / PROTO — one design language
              </p>
            </div>

            {/* RIGHT — pillar ledger */}
            <ScrollReveal
              as="div"
              className={clsx('grid', 'grid--2', styles.pillars)}
              stagger={0.08}
              y={26}
            >
              {north.pillars.map((pillar, i) => {
                const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
                return (
                  <DataPanel
                    key={pillar.id}
                    interactive
                    code={pillar.code}
                    className={styles.pillar}
                  >
                    <span className={styles.pillarIcon} aria-hidden="true">
                      <Icon size={18} strokeWidth={1.25} />
                    </span>
                    <h3 className={clsx('heading-3', styles.pillarTitle)}>
                      {pillar.title}
                    </h3>
                    <p className={clsx('body-sm', 'text-dim', styles.pillarBody)}>
                      {pillar.body}
                    </p>
                  </DataPanel>
                );
              })}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3 — ENGINEERING PRINCIPLES ------------------------------------ */}
      <OperatingPrinciples
        principles={engineeringPrinciples}
        eyebrow="Engineering Principles"
        title="How North builds."
      />

      {/* 4 — SYSTEM DESIGN APPROACH (page-local staged sequence) ------- */}
      <section className={clsx('section', styles.approach)}>
        <div className="container">
          <SectionHeader
            eyebrow="System Design Approach"
            title="Four passes, in order."
            intro="Every system North ships moves through the same sequence — operation first, surface last."
            code="SEQ.BUILD"
            size="h1"
          />

          <ScrollReveal
            as="ol"
            className={styles.steps}
            stagger={0.1}
            y={30}
          >
            {designApproach.map((step, i) => {
              const isLast = i === designApproach.length - 1;
              return (
                <li key={step.id} className={styles.step}>
                  <div className={styles.stepMarker} aria-hidden="true">
                    <span className={styles.stepNum}>{step.step}</span>
                    {!isLast && <span className={styles.connector} />}
                  </div>

                  <div className={styles.stepBody}>
                    <h3 className={clsx('heading-3', styles.stepTitle)}>
                      {step.title}
                    </h3>
                    <p className={clsx('body-sm', 'text-dim', styles.stepText)}>
                      {step.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ScrollReveal>
        </div>
      </section>

      {/* 5 — CAPABILITIES MATRIX --------------------------------------- */}
      <CapabilitiesMatrix />

      {/* 6 — MOTION PHILOSOPHY (page-local statement field) ------------ */}
      <section className={clsx('section', styles.motion)}>
        <SystemGrid nodes={5} className={styles.motionGrid} />

        <div className={clsx('container', styles.motionInner)}>
          <span className={clsx('eyebrow', styles.motionEyebrow)}>
            {north.motion.eyebrow}
          </span>

          <KineticText
            as="h2"
            by="word"
            text={north.motion.title}
            className={clsx('display', styles.motionTitle)}
          />

          <div className={clsx('grid', 'grid--split', styles.motionSplit)}>
            <ScrollReveal as="div" className={clsx('stack', 'stack-5', styles.motionBody)}>
              {north.motion.body.map((line, i) => (
                <p key={i} className={clsx('lead', styles.motionLine)}>
                  {line}
                </p>
              ))}
            </ScrollReveal>

            {/* mono k/v telemetry list */}
            <ScrollReveal as="dl" className={styles.notes} stagger={0.08} y={20}>
              {north.motion.notes.map((note) => (
                <div key={note.k} className={styles.note}>
                  <dt className={clsx('mono', styles.noteKey)}>{note.k}</dt>
                  <dd className={clsx('body-sm', styles.noteVal)}>{note.v}</dd>
                </div>
              ))}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7 — PLATFORM / STACK ARCHITECTURE ----------------------------- */}
      <ArchitectureShowcase />

      {/* 8 — INTERFACE LAB / DESIGN LANGUAGE (page-local) -------------- */}
      <section className={clsx('section', styles.lab)}>
        <span className={styles.rail} aria-hidden="true" />

        <div className="container">
          <div className={styles.labHead}>
            <SectionHeader
              eyebrow={interfaceLanguage.eyebrow}
              title={interfaceLanguage.title}
              intro={interfaceLanguage.body}
              code="LAB.IFACE"
              size="h1"
            />
            <Pill variant="red" dot className={styles.labTag}>
              LAB // CALIBRATED
            </Pill>
          </div>

          <div className={clsx('grid', 'grid--split', styles.labSplit)}>
            {/* LEFT — stack groups as panels */}
            <div className={styles.labStack}>
              <div className={styles.labStackHead}>
                <span className={clsx('data-label', styles.labStackLabel)}>
                  {stack.eyebrow}
                </span>
                <p className={clsx('body-sm', 'text-dim', styles.labStackIntro)}>
                  {stack.body}
                </p>
              </div>

              <ScrollReveal
                as="div"
                className={clsx('grid', 'grid--3', styles.stackGroups)}
                stagger={0.08}
                y={24}
              >
                {stack.groups.map((group) => (
                  <DataPanel
                    key={group.id}
                    code={group.label}
                    brackets={false}
                    className={styles.stackGroup}
                  >
                    <ul className={styles.stackItems}>
                      {group.items.map((item) => (
                        <li key={item} className={clsx('body-sm', styles.stackItem)}>
                          <span className="node-dot" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </DataPanel>
                ))}
              </ScrollReveal>
            </div>

            {/* RIGHT — interface rules as a mono k/v table */}
            <ScrollReveal as="div" className={styles.rules} y={28}>
              <div className={styles.rulesHead}>
                <span className={clsx('mono', styles.rulesCode)}>IFACE.RULES</span>
                <ArrowDownRight size={14} strokeWidth={1.5} aria-hidden="true" />
              </div>

              <dl className={styles.ruleList}>
                {interfaceLanguage.rules.map((rule) => (
                  <div key={rule.k} className={styles.rule}>
                    <dt className={clsx('mono', styles.ruleKey)}>{rule.k}</dt>
                    <dd className={clsx('body-sm', styles.ruleVal)}>{rule.v}</dd>
                  </div>
                ))}
              </dl>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 9 — CONTACT CTA ----------------------------------------------- */}
      <ContactSection variant="cta" />
    </PageTransition>
  );
}

export default HanoryxNorth;
