import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, CheckCircle2, Code2, ArrowRight } from 'lucide-react';
import { solidCaseStudies } from '../../data/solidCaseStudies';

export default function SOLIDCaseStudy() {
  const [activeCase, setActiveCase] = useState(solidCaseStudies[0]);
  const [showSolution, setShowSolution] = useState(false);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Case Selection Sidebar */}
        <div className="w-full md:w-1/3 space-y-4">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Code2 className="text-emerald-400" />
            SOLID Lab
          </h2>
          {solidCaseStudies.map((study) => (
            <button
              key={study.id}
              onClick={() => {
                setActiveCase(study);
                setShowSolution(false);
              }}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                activeCase.id === study.id
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                  : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700'
              }`}
            >
              <div className="font-bold text-sm mb-1">{study.title}</div>
              <div className="text-[10px] opacity-60 uppercase tracking-widest">{study.principle}</div>
            </button>
          ))}
        </div>

        {/* Interactive Content area */}
        <div className="flex-grow bg-gray-900/50 border border-gray-800 rounded-3xl p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            {showSolution ? <CheckCircle2 size={200} /> : <ShieldAlert size={200} />}
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{activeCase.title}</h3>
                <p className="text-gray-400 text-sm max-w-xl">{activeCase.description}</p>
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-mono border ${
                showSolution ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {showSolution ? 'REFACTORED' : 'VIOLATION'}
              </div>
            </div>

            <div className="flex bg-gray-950 rounded-2xl p-1 w-fit border border-gray-800">
              <button
                onClick={() => setShowSolution(false)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  !showSolution ? 'bg-amber-500/20 text-amber-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                The Problem
              </button>
              <button
                onClick={() => setShowSolution(true)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                  showSolution ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                The Fix
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={showSolution ? 'sol' : 'viol'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className={`p-4 rounded-xl border flex gap-3 ${
                  showSolution ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'
                }`}>
                  {showSolution ? <Shield className="text-emerald-400 shrink-0" /> : <ShieldAlert className="text-amber-400 shrink-0" />}
                  <p className="text-sm text-gray-300 italic">
                    {showSolution ? activeCase.solution.description : activeCase.violation.description}
                  </p>
                </div>

                <div className="bg-gray-950 rounded-2xl p-6 border border-gray-800 font-mono text-xs overflow-x-auto shadow-inner leading-relaxed">
                  <pre className="text-emerald-400/90 italic mb-4 text-[10px]">
                    // {activeCase.principle} Demonstration
                  </pre>
                  <code className="text-gray-300 block whitespace-pre">
                    {showSolution ? activeCase.solution.code : activeCase.violation.code}
                  </code>
                </div>
              </motion.div>
            </AnimatePresence>

            {showSolution && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-400 text-sm font-bold pt-4"
              >
                Refactoring Complete <ArrowRight size={16} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
