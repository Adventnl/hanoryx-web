import { useEffect } from 'react';
import { AnimationProvider } from './providers/AnimationProvider';
import { AudioProvider } from './providers/AudioProvider';
import { LenisProvider } from './providers/LenisProvider';
import { SiteShell } from '../components/layout/SiteShell';
import { AppRoutes } from './routes';
import { initPointer } from '../animation/pointer';

/**
 * App = providers + shell + routes. Pointer tracking is initialised once so
 * every scene can read it without its own listener.
 */
export default function App() {
  useEffect(() => {
    initPointer();
  }, []);

  return (
    <AnimationProvider>
      <AudioProvider>
        <LenisProvider>
          <SiteShell>
            <AppRoutes />
          </SiteShell>
        </LenisProvider>
      </AudioProvider>
    </AnimationProvider>
  );
}
