import { ReactNode, createContext, useContext, useState, useEffect } from 'react';

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다');
  }

  const response = await fetch(import.meta.env.VITE_API_URL + '/api/reissue', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-Refresh-Token': refreshToken,
    },
    body: null,
  });

  if (!response.ok) {
    console.log(response);
    throw new Error('토큰 재발행 실패');
  } else {
    const token = response.headers.get('Authorization')!.replace('Bearer ', '');
    const refreshToken = response.headers.get('X-Refresh-Token')!;

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    return token;
  }
}

async function fetchAuth(url: string, method: string, payload?: object) {
  const token = localStorage.getItem('token');
  const isFormData = payload instanceof FormData;

  if (!token) {
    throw new Error('로그인 필요');
  }

  let response = await fetch(import.meta.env.VITE_API_URL + url, {
    method,
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    },
    body: isFormData ? payload : JSON.stringify(payload),
  });

  if (response.status === 401) {
    response = await fetch(import.meta.env.VITE_API_URL + url, {
      method,
      credentials: 'include',
      headers: {
        Authorization: `Bearer ${await refreshAccessToken()}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
      body: isFormData ? payload : JSON.stringify(payload),
    });
  }

  if (!response.ok) {
    console.log(response);
    throw new Error('데이터를 가져오는데 실패했습니다');
  }

  return response.json();
}

async function login(values: { id: string; password: string }) {
  const response = await fetch(import.meta.env.VITE_API_URL + '/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    console.log(response);
    return null;
  } else {
    const token = response.headers.get('Authorization')!.replace('Bearer ', '');
    const refreshToken = response.headers.get('X-Refresh-Token')!;
    const data = await response.json();

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  }
}

async function logout() {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken')!;

  const response = await fetch(import.meta.env.VITE_API_URL + '/api/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      Authorization: `Bearer ${token}`,
      'X-Refresh-Token': refreshToken,
    },
    body: null,
  });

  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');

  if (!response.ok) {
    console.error('로그아웃 실패', response);
  }
}

type User = { nickname: string; id: string; email: string; joiningDate: string };

type AuthContextType = {
  isAuth: boolean;
  user: User;
  setUser: (user: User) => void;
  fetchAuth: (url: string, method: string, payload?: object) => Promise<any>;
  login: (values: { id: string; password: string }) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({ nickname: '', id: '', email: '', joiningDate: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      setIsAuth(true);
      setUser(JSON.parse(user));
    } else {
      setIsAuth(false);
      setUser({ nickname: '', id: '', email: '', joiningDate: '' });
    }
  }, []);

  const handleLogin = async (values: { id: string; password: string }) => {
    const user = await login(values);
    if (user != null) {
      setIsAuth(true);
      setUser(user);
      return true;
    } else {
      return false;
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsAuth(false);
    setUser({ nickname: '', id: '', email: '', joiningDate: '' });
  };

  return (
    <AuthContext.Provider value={{ isAuth, user, setUser, fetchAuth, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다');
  }

  return context;
};
