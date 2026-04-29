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
    <div className="fixed top-6 left-1/2 -translate-x-1/2 md:left-auto md:-translate-x-0 md:right-10 z-[100] flex items-center gap-4 bg-hero-base/60 backdrop-blur-md p-2 md:pl-6 rounded-full border border-hero-mid shadow-lg">
      
      {/* Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 mr-4 text-sm font-medium">
        <a href="#about" className="text-hero-text hover:text-electric-blue transition-colors">About</a>
        <a href="#skills" className="text-hero-text hover:text-electric-blue transition-colors">Skills</a>
        <a href="#projects" className="text-hero-text hover:text-electric-blue transition-colors">Projects</a>
        <a href="#aichat" className="text-hero-text hover:text-electric-blue transition-colors">AI Chat</a>
      </nav>

      <div className="w-px h-6 bg-hero-text/20 hidden md:block"></div>

      <button 
        onClick={toggleTheme}
        className="text-hero-text hover:text-electric-blue transition-colors outline-none focus:outline-none pl-4 md:pl-0"
        aria-label="Toggle theme"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-electric-blue to-emerald-accent flex items-center justify-center shadow-lg hover:opacity-90 cursor-pointer transition-opacity">
        <User className="text-white" size={20} />
      </div>

    </div>
  );
}
