import { motion } from 'framer-motion';
import { GitBranch, ExternalLink, Star, Users, Activity } from 'lucide-react';

const projects = [
  {
    title: 'AI Crypto Dashboard',
    desc: 'Real-time dashboard tracking crypto volatility using Gemini AI to predict trends.',
    tech: ['React', 'Node.js', 'Socket.io'],
    github: '#',
    live: '#',
    stats: { stars: 128, users: '1.2k', uptime: '99.9%' }
  },
  {
    title: 'O-Auth Gateway',
    desc: 'Secure standalone microservice managing OAuth2 handshakes.',
    tech: ['Express', 'JWT', 'Redis'],
    github: '#',
    live: undefined,
    stats: { stars: 85, users: '300+', uptime: '100%' }
  }
];

export default function Projects() {
  return (
    <motion.section 
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <h2 className="text-3xl font-bold mb-8 text-emerald-accent">Featured Projects</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((proj, idx) => (
          <motion.div 
            key={idx} 
            whileHover={{ y: -5 }}
            className="glass-panel p-8 flex flex-col h-full relative overflow-hidden group cursor-default"
          >
            {/* Interactive Background Gradient on Hover */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <h3 className="text-2xl font-bold mb-3 z-10 text-hero-text">{proj.title}</h3>
            <p className="text-hero-text opacity-70 mb-6 flex-grow z-10">{proj.desc}</p>
            
            <div className="flex flex-wrap gap-2 mb-6 z-10">
              {proj.tech.map((t) => (
                <motion.span 
                  key={t}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 255, 157, 0.2)' }}
                  className="bg-hero-base/80 text-hero-text text-xs px-3 py-1 rounded-full border border-hero-mid transition-colors cursor-pointer"
                >
                  {t}
                </motion.span>
              ))}
            </div>

            {/* Random Interactive Stats that appear on hover */}
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              whileHover={{ height: 'auto', opacity: 1 }}
              className="flex justify-between items-center bg-hero-base/50 rounded-lg p-3 mb-6 border border-hero-mid/50"
            >
              <div className="flex items-center gap-1.5 text-xs text-yellow-500">
                <Star size={14} /> {proj.stats.stars}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-blue-400">
                <Users size={14} /> {proj.stats.users}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-accent">
                <Activity size={14} /> {proj.stats.uptime}
              </div>
            </motion.div>

            <div className="flex space-x-4 mt-auto z-10">
              <motion.a 
                whileHover={{ scale: 1.2, rotate: 5 }}
                href={proj.github} 
                className="text-hero-text opacity-60 hover:opacity-100 hover:text-electric-blue transition-all"
              >
                <GitBranch size={20} />
              </motion.a>
              {proj.live && (
                <motion.a 
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  href={proj.live} 
                  className="text-hero-text opacity-60 hover:opacity-100 hover:text-emerald-accent transition-all"
                >
                  <ExternalLink size={20} />
                </motion.a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
