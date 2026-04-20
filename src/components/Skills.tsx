import { motion } from 'framer-motion';
import { Database, Layout, Server, Code, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const skills = [
  { id: 'react--vite', name: 'React / Vite', icon: Layout, color: 'text-blue-400', level: 95, details: 'Component Architecture, Hooks, Context API, Performance Profiling.' },
  { id: 'typescript', name: 'TypeScript', icon: Code, color: 'text-blue-600', level: 90, details: 'Generics, Strict Mode, Utility Types, Interface Design.' },
  { id: 'nodejs--express', name: 'Node.js / Express', icon: Server, color: 'text-green-500', level: 85, details: 'RESTful APIs, Middleware, Event Loop, Stream Processing.' },
  { id: 'mysql--db-arch', name: 'MySQL / DB Arch.', icon: Database, color: 'text-orange-400', level: 80, details: 'Schema Design, Normalization, Indexing, Query Optimization.' }
];

export default function Skills() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold mb-8 text-electric-blue flex items-center gap-3">
        Core Competencies <Sparkles className="text-yellow-400 animate-pulse" />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((skill) => {
          const Icon = skill.icon;
          
          return (
            <Link to={`/skill/${skill.id}`} key={skill.id}>
              <motion.div 
                whileHover={{ scale: 1.05, y: -5 }}
                className="glass-panel h-52 p-6 flex flex-col items-center justify-center space-y-4 cursor-pointer relative overflow-hidden group hover:shadow-[0_0_20px_-5px_var(--color-electric-blue)]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-electric-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex flex-col items-center gap-2 z-10 text-center">
                  <Icon size={40} className={`${skill.color} transition-all duration-300 group-hover:scale-110`} />
                  <span className="font-medium text-gray-200 mt-2">{skill.name}</span>
                  <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-2">
                    Interactive Demo <ArrowRight size={12} />
                  </span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.section>
  );
}
