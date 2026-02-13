import { useEffect, useState } from 'react';

export default function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dark_mode', JSON.stringify(dark));
  }, [dark]);

  return [dark, setDark];
}
