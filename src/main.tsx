import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Root from './pages/Root.tsx';
import Main from './pages/Main.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route index element={<Main />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
