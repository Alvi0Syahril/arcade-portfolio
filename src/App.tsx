import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Mail, Link as LinkIcon } from 'lucide-react';
import Home from './pages/Home';
import SkillDetail from './pages/SkillDetail';
import Navbar from './components/Navbar';

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Router>
      <div className="min-h-screen pt-10 pb-20 px-4 md:px-10 lg:px-20 flex flex-col relative overflow-hidden">
        {/* Interactive Glowing Background Orb */}
        <motion.div
          className="pointer-events-none fixed top-0 left-0 w-[500px] h-[500px] rounded-full filter blur-[100px] opacity-10 z-0"
          style={{ background: 'var(--color-electric-blue)' }}
          animate={{ x: mousePos.x - 250, y: mousePos.y - 250 }}
          transition={{ type: 'tween', ease: 'easeOut', duration: 1 }}
        />

        <div className="z-10 relative flex flex-col flex-grow">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/skill/:id" element={<SkillDetail />} />
            </Routes>
          </div>
          
          <footer className="text-center text-hero-text pt-10 mt-32 border-t border-electric-blue/20">
            <div className="flex justify-center space-x-6 mb-6">
              <a href="https://github.com/Alvi0Syahril" target="_blank" rel="noreferrer" className="hover:text-electric-blue transition-colors flex items-center gap-2"><LinkIcon size={20} /> <span className="text-sm">GitHub</span></a>
              <a href="#" className="hover:text-electric-blue transition-colors flex items-center gap-2"><Globe size={20} /> <span className="text-sm">LinkedIn</span></a>
              <a href="#" className="hover:text-electric-blue transition-colors flex items-center gap-2"><Mail size={20} /> <span className="text-sm">Contact</span></a>
            </div>
            <p className="text-sm opacity-80">© {new Date().getFullYear()} ALVI SYAHRIL. Built with React & Express.</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;
