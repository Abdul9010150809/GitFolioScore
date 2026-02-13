import { useState, useEffect } from 'react';

export default function useAuth() {
  const [token, setToken] = useState(null);
  const [login, setLogin] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    const l = params.get('login');
    if (t) {
      setToken(t);
      setLogin(l);
      localStorage.setItem('github_token', t);
      localStorage.setItem('github_login', l);
      window.history.replaceState({}, document.title, '/');
    } else {
      const storedToken = localStorage.getItem('github_token');
      const storedLogin = localStorage.getItem('github_login');
      if (storedToken) setToken(storedToken);
      if (storedLogin) setLogin(storedLogin);
    }
  }, []);

  const logout = () => {
    setToken(null);
    setLogin(null);
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_login');
  };

  return { token, login, logout };
}
