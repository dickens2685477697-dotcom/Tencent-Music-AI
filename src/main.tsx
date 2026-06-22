import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { PlayerProvider } from './context/PlayerContext';
import { YinxinProvider } from './context/YinxinContext';
import './styles/tokens.css';
import './styles/base.css';
import './styles/yinxin.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <YinxinProvider><PlayerProvider><App /></PlayerProvider></YinxinProvider>
    </BrowserRouter>
  </StrictMode>,
);
