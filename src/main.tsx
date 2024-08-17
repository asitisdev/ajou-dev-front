import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Root from './pages/Root.tsx';
import NotFound from './pages/NotFound.tsx';
import Main from './pages/Main.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import FreeboardList from './pages/FreeboardList.tsx';
import FreeboardWrite from './pages/FreeboardWrite.tsx';
import FreeboardEdit from './pages/FreeboardEdit.tsx';
import Freeboard from './pages/Freeboard.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Root />}>
            <Route index element={<Main />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/freeboard" element={<FreeboardList />}></Route>
            <Route
              path="/freeboard/write"
              element={
                <ProtectedRoute>
                  <FreeboardWrite />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="/freeboard/:postNum" element={<Freeboard />}></Route>
            <Route path="/freeboard/:postNum/edit" element={<FreeboardEdit />}></Route>
            <Route path="/*" element={<NotFound />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
