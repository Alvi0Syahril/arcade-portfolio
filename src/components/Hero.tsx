import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Code, Database, Sparkles, Mail } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import PhysicsPlayground, { PlatformConfig } from './PhysicsPlayground';

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  
  // The Platform Tiers (Bottom to Top)
  const p1Ref = useRef<HTMLDivElement>(null); 
  const p2Ref = useRef<HTMLDivElement>(null);
  const p3Ref = useRef<HTMLDivElement>(null);
  const p4Ref = useRef<HTMLDivElement>(null);



  const [domReady, setDomReady] = useState(false);
  const [contactHovered, setContactHovered] = useState(false);
  useEffect(() => { setTimeout(() => setDomReady(true), 300); }, []);



  return (
    <motion.section 
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 50, damping: 15 }}
      style={{ transformOrigin: 'bottom center' }}
      className="w-full h-[850px] relative glass-panel overflow-hidden border-2 border-transparent mx-auto mt-6"
    >
      {/* Background Arcade Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#32CD32_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>

      {/* --- LEVEL MAP STRUCTURING --- */}
      
      {/* Target: Tier 4 (Top, Flat) */}
      <div ref={p4Ref} className="absolute top-[80px] left-1/2 -translate-x-1/2 bg-hero-base px-12 py-6 rounded-lg whitespace-nowrap z-10 border-t-4 border-electric-blue shadow-lg">
         <h1 className="text-5xl font-extrabold tracking-tight">Hi, I'm <span className="text-electric-blue drop-shadow-md">ALVI SYAHRIL</span></h1>
      </div>



      {/* Tier 3 (Sloped Counter-Clockwise: Bottom-Left to Top-Right) */}
      <div ref={p3Ref} className="absolute top-[280px] w-[75%] right-[-5%] bg-hero-mid p-6 rounded-l-2xl border-t-4 border-electric-blue/60 z-10 shadow-xl" style={{ transform: 'rotate(-4deg)' }}>
         <p className="text-xl md:text-2xl font-mono pl-10 max-w-xl text-hero-text">
           A Senior Full-Stack Architect crafting <span className="text-emerald-accent">intelligent scalable systems</span>.
         </p>
      </div>



      {/* Tier 2 (Sloped Clockwise: Bottom-Right to Top-Left) */}
      <div ref={p2Ref} className="absolute top-[480px] w-[80%] left-[-5%] bg-hero-mid p-8 rounded-r-2xl border-t-4 border-electric-blue/40 z-10 flex gap-6 pl-16 shadow-xl" style={{ transform: 'rotate(4deg)' }}>
         <button className="px-8 py-3 bg-electric-blue text-white font-bold text-lg rounded shadow-lg hover:opacity-90 transition-all">
           Explore My Work
         </button>

         {/* Contact Me — email bubble on hover */}
         <div
           className="relative"
           onMouseEnter={() => setContactHovered(true)}
           onMouseLeave={() => setContactHovered(false)}
         >
           <button className="px-8 py-3 bg-gray-800 border-2 border-gray-500 text-gray-200 font-bold text-lg rounded hover:border-electric-blue transition-colors">
             Contact Me
           </button>

           <AnimatePresence>
             {contactHovered && (
               <motion.div
                 initial={{ opacity: 0, y: 8, scale: 0.9 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: 8, scale: 0.9 }}
                 transition={{ duration: 0.18, ease: 'easeOut' }}
                 className="absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 z-50 whitespace-nowrap"
               >
                 <a
                   href="https://mail.google.com/mail/u/0/"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="flex items-center gap-2 bg-hero-base border border-electric-blue/50 text-electric-blue text-sm font-mono px-4 py-2 rounded-xl shadow-lg hover:opacity-90 transition-all cursor-pointer"
                 >
                   <Mail size={14} />
                   alfis1755@gmail.com
                 </a>
                 {/* Bubble tail */}
                 <div className="w-3 h-3 bg-black border-r border-b border-[#32CD32]/50 rotate-45 mx-auto -mt-1.5" />
               </motion.div>
             )}
           </AnimatePresence>
         </div>
      </div>



      {/* Tier 1 (Floor) (Sloped Counter-Clockwise: Bottom-Left to Top-Right) */}
      <div ref={p1Ref} className="absolute top-[720px] w-[110%] left-[-5%] bg-hero-floor p-8 border-t-8 border-sky-700 z-10 flex justify-center gap-16 shadow-2xl" style={{ transform: 'rotate(-2deg)' }}>
         <div className="flex flex-col items-center gap-2">
            <Terminal size={32} className="text-pink-500" />
            <span className="text-md font-mono text-gray-400 uppercase tracking-widest">Frontend</span>
         </div>
         <div className="flex flex-col items-center gap-2">
            <Code size={32} className="text-electric-blue" />
            <span className="text-md font-mono text-gray-400 uppercase tracking-widest">Backend</span>
         </div>
         <div className="flex flex-col items-center gap-2">
            <Database size={32} className="text-amber-500" />
            <span className="text-md font-mono text-gray-400 uppercase tracking-widest">Database</span>
         </div>
      </div>

      {domReady && (
         <PhysicsPlayground 
           containerRef={containerRef} 
           platforms={[
              { ref: p4Ref, angle: 0 },
              { ref: p3Ref, angle: -4 },
              { ref: p2Ref, angle: 4 },
              { ref: p1Ref, angle: -2 }
           ]}
         />
      )}
    </motion.section>
  );
}
