import { Sun, Moon, User } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check initial document state or local storage
    const isLight = document.documentElement.classList.contains('light-mode');
    setIsDarkMode(!isLight);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.add('light-mode');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.remove('light-mode');
      setIsDarkMode(true);
    }
  };

  return (
    <div className="fixed top-6 right-6 lg:right-10 z-[100] flex items-center gap-4 bg-dark-bg/50 backdrop-blur-md p-2 pl-4 rounded-full border border-gray-700/50 shadow-lg">
      
      <button 
        onClick={toggleTheme}
        className="text-gray-300 hover:text-electric-blue transition-colors outline-none focus:outline-none"
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-electric-blue to-emerald-accent flex items-center justify-center shadow-[0_0_10px_rgba(0,255,157,0.3)]">
        <User className="text-dark-bg" size={20} />
      </div>

    </div>
  );
}
