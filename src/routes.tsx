import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.tsx';
import Root from './pages/Root.tsx';
import NotFound from './pages/NotFound.tsx';
import Main from './pages/Main.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Mypage from './pages/Mypage.tsx';
import FreeboardList from './pages/FreeboardList.tsx';
import FreeboardWrite from './pages/FreeboardWrite.tsx';
import FreeboardEdit from './pages/FreeboardEdit.tsx';
import Freeboard from './pages/Freeboard.tsx';
import PostList from './pages/PostList.tsx';

export default function AppRoutes() {
  const { isAuth } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Main />}></Route>
        <Route path="/login" element={isAuth ? <Navigate to="/" /> : <Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/mypage" element={<Mypage />}></Route>
        <Route path="/freeboard" element={<FreeboardList />}></Route>
        <Route path="/freeboard/write" element={isAuth ? <FreeboardWrite /> : <Navigate to="/login" />}></Route>
        <Route path="/freeboard/:postNum" element={<Freeboard />}></Route>
        <Route path="/freeboard/:postNum/edit" element={<FreeboardEdit />}></Route>
        <Route path="/members/:userId/posts" element={<PostList />}></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Route>
    </Routes>
  );
}
