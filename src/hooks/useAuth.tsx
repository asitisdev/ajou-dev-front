import { ReactNode, createContext, useContext, useState, useEffect } from 'react';

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다');
  }

  const response = await fetch('/api/reissue', {
    method: 'POST',
    headers: {
      'x-refresh-token': refreshToken,
    },
    body: null,
  });

  if (!response.ok) {
    console.log(response);
    throw new Error('토큰 재발행 실패');
  } else {
    const token = response.headers.get('Authorization')!.replace('Bearer ', '');
    const refreshToken = response.headers.get('x-refresh-token')!;

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);

    return token;
  }
}

async function fetchAuth(url: string, method: string, payload?: object) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('로그인 필요');
  }

  let response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${await refreshAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  }

  if (!response.ok) {
    console.log(response);
    throw new Error('데이터를 가져오는데 실패했습니다');
  }

  return response.json();
}

async function login(values: { id: string; password: string }) {
  const response = await fetch('/api/login', {
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
    const refreshToken = response.headers.get('x-refresh-token')!;
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

  const response = await fetch('/api/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-refresh-token': refreshToken,
    },
    body: null,
  });

  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');

  if (!response.ok) {
    console.error('로그아웃 실패', response);
  }
}

const AuthContext = createContext({
  isAuth: false,
  user: { nickname: '', id: '', email: '', joiningDate: '' },
  fetchAuth,
  login,
  logout,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({ nickname: '', id: '', email: '', joiningDate: '' });

  useEffect(() => {
    console.log('changed to', isAuth);
  }, [isAuth]);

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
    <AuthContext.Provider value={{ isAuth, user, fetchAuth, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);