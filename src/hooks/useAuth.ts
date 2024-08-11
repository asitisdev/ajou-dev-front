import { useState, useEffect } from 'react';

async function refreshAccessToken() {
  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('리프레시 토큰이 없습니다');
  }

  const response = await fetch('/api/reissue', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-refresh-token': refreshToken,
    },
    body: null,
  });

  if (!response.ok) {
    console.log(response);
    throw new Error('토큰 재발행 실패');
  } else {
    const authHeader = response.headers.get('Authorization');
    const refreshTokenHeader = response.headers.get('x-refresh-token')!;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshTokenHeader);
    }

    return token;
  }
}

async function postAuth(url: string, payload = {}) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('로그인 필요');
  }

  let response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    response = await fetch(url, {
      method: 'POST',
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
    return false;
  } else {
    const token = response.headers.get('Authorization')!.replace('Bearer ', '');
    const refreshToken = response.headers.get('x-refresh-token')!;
    const data = await response.json();

    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return true;
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

  if (!response.ok) {
    console.log(response);
    throw new Error('로그아웃 실패');
  }

  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
}

const useAuth = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuth(!!token);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogin = async (values: { id: string; password: string }) => {
    if (await login(values)) {
      setUser(user);
      setIsAuth(true);
      return true;
    } else {
      return false;
    }
  };

  const handleLogout = async () => {
    logout();
    setUser(null);
    setIsAuth(false);
  };

  return {
    isAuth,
    user,
    setUser,
    postAuth,
    login: handleLogin,
    logout: handleLogout,
  };
};

export default useAuth;
