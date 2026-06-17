import { AnimationProvider } from './providers/AnimationProvider';
import { LenisProvider } from './providers/LenisProvider';
import { SiteShell } from '../components/layout/SiteShell';
import { AppRoutes } from './routes';

/**
 * App = providers + shell + routes only. All visual/content work lives in
 * the component, section, and page layers.
 */
export default function App() {
  return (
    <AnimationProvider>
      <LenisProvider>
        <SiteShell>
          <AppRoutes />
        </SiteShell>
      </LenisProvider>
    </AnimationProvider>
  );
}
