import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import { DialogProvider } from '@/hooks/useDialog.tsx';
import AppRoutes from './routes.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <DialogProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </DialogProvider>
    </AuthProvider>
  </StrictMode>
);
