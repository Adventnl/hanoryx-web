import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/App.jsx';

import './styles/tokens.css';
import './styles/globals.css';
import './styles/typography.css';
import './styles/layout.css';
import './styles/animation.css';
import './styles/effects.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
