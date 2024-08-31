import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.tsx';
import Root from './pages/Root.tsx';
import NotFound from './pages/NotFound.tsx';
import Main from './pages/Main.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import Mypage from './pages/Mypage.tsx';
import SearchList from './pages/SearchList.tsx';
import FreeboardList from './pages/freeboard/FreeboardList.tsx';
import FreeboardWrite from './pages/freeboard/FreeboardWrite.tsx';
import FreeboardEdit from './pages/freeboard/FreeboardEdit.tsx';
import Freeboard from './pages/freeboard/Freeboard.tsx';
import QuestionList from './pages/question/QuestionList.tsx';
import QuestionWrite from './pages/question/QuestionWrite.tsx';
import PostList from './pages/members/PostList.tsx';
import CommentList from './pages/members/CommentList.tsx';
import LikeList from './pages/members/LikeList.tsx';

export default function AppRoutes() {
  const { isAuth } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Root />}>
        <Route index element={<Main />}></Route>
        <Route path="/login" element={isAuth ? <Navigate to="/" /> : <Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/mypage" element={isAuth ? <Mypage /> : <Navigate to="/login" />}></Route>
        <Route path="/search" element={<SearchList />}></Route>

        <Route path="/freeboard" element={<FreeboardList />}></Route>
        <Route path="/freeboard/write" element={isAuth ? <FreeboardWrite /> : <Navigate to="/login" />}></Route>
        <Route path="/freeboard/:postNum" element={<Freeboard />}></Route>
        <Route path="/freeboard/:postNum/edit" element={<FreeboardEdit />}></Route>

        <Route path="/question" element={<QuestionList />}></Route>
        <Route path="/question/write" element={<QuestionWrite />}></Route>

        <Route path="/members/:userId/likes" element={<LikeList />}></Route>
        <Route path="/members/:userId/posts" element={<PostList />}></Route>
        <Route path="/members/:userId/comments" element={<CommentList />}></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Route>
    </Routes>
  );
}
