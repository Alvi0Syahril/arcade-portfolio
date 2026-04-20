import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SkillDetail from './pages/SkillDetail';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen pt-10 pb-20 px-4 md:px-10 lg:px-20 flex flex-col relative overflow-hidden">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/skill/:id" element={<SkillDetail />} />
          </Routes>
        </div>
        
        <footer className="text-center text-gray-500 pt-10 mt-32 border-t border-gray-800">
          <p>© {new Date().getFullYear()} Professional AI Portfolio. Built with React & Express.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
