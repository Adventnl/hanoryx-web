import { useEffect } from 'react';
import { AnimationProvider } from './providers/AnimationProvider';
import { AudioProvider } from './providers/AudioProvider';
import { LenisProvider } from './providers/LenisProvider';
import { ExperienceProvider } from './providers/ExperienceProvider';
import { SiteShell } from '../components/layout/SiteShell';
import { AppRoutes } from './routes';
import { initPointer } from '../animation/pointer';
import { initPerformanceMode } from '../performance/performanceMode';
import { initViewportDirector } from '../performance/viewportDirector';

/**
 * App = providers + shell + routes. Pointer tracking, the fast-scroll governor,
 * and the viewport director are initialised once so every scene/reveal reads
 * them without its own listener.
 */
export default function App() {
  useEffect(() => {
    initPointer();
    initPerformanceMode();
    initViewportDirector();
  }, []);

  return (
    <AnimationProvider>
      <AudioProvider>
        <LenisProvider>
          <ExperienceProvider>
            <SiteShell>
              <AppRoutes />
            </SiteShell>
          </ExperienceProvider>
        </LenisProvider>
      </AudioProvider>
    </AnimationProvider>
  );
}
