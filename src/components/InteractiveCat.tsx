import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function InteractiveCat({ tilt }: { tilt: number }) {
  const [pos, setPos] = useState({ x: 50, y: 10 });
  const [status, setStatus] = useState<'falling' | 'running' | 'climbing'>('falling');
  const [dir, setDir] = useState<1 | -1>(1); // -1 = left, 1 = right
  
  const xRef = useRef(50);
  const yRef = useRef(10);
  const vYRef = useRef(0);
  const animationRef = useRef<number>();

  // State refs to bypass React dependency cycle issues in animation loop
  const statusRef = useRef(status);
  const dirRef = useRef(dir);
  useEffect(() => { statusRef.current = status; }, [status]);
  useEffect(() => { dirRef.current = dir; }, [dir]);

  useEffect(() => {
    let lastTime = performance.now();
    
    const updatePhysics = (time: number) => {
      const dt = (time - lastTime) / 16; 
      lastTime = time;
      
      const isTilted = Math.abs(tilt) > 1.5;
      let currentStatus = statusRef.current;
      let currentDir = dirRef.current;
      
      if (isTilted) {
        currentStatus = 'falling';
        vYRef.current += 0.5 * dt; // gravity pulls!
        if (vYRef.current > 5) vYRef.current = 5;
        
        yRef.current += vYRef.current * dt;
        xRef.current += (tilt > 0 ? 0.3 : -0.3) * dt;
        
      } else {
        // Safe from gravity
        if (currentStatus === 'falling') {
          // Keep falling until floor
          vYRef.current += 0.5 * dt;
          yRef.current += vYRef.current * dt;
          if (yRef.current >= 85) {
             yRef.current = 85;
             vYRef.current = 0;
             currentStatus = 'running';
          }
        }
        
        if (currentStatus === 'running') {
          // Run along floor
          xRef.current += (0.4 * currentDir) * dt;
          
          if (xRef.current <= 2) {
             xRef.current = 2;
             currentStatus = 'climbing';
             currentDir = -1; // up left wall
          } else if (xRef.current >= 90) {
             xRef.current = 90;
             currentStatus = 'climbing';
             currentDir = 1; // up right wall
          }
        }
        
        if (currentStatus === 'climbing') {
          // Crawl up the wall
          yRef.current -= 0.4 * dt; 
          
          if (yRef.current <= 5) {
             yRef.current = 5;
             // Push off wall and fall back to floor!
             currentStatus = 'falling';
             currentDir = currentDir === 1 ? -1 : 1; 
             xRef.current += currentDir === 1 ? -3 : 3;
          }
        }
      }
      
      // Hard Box Boundaries
      if (yRef.current >= 85) { yRef.current = 85; }
      if (yRef.current <= 2) { yRef.current = 2; }
      if (xRef.current >= 92) { xRef.current = 92; }
      if (xRef.current <= 2) { xRef.current = 2; }
      
      if (currentStatus !== statusRef.current) setStatus(currentStatus);
      if (currentDir !== dirRef.current) setDir(currentDir);
      
      setPos({ x: xRef.current, y: yRef.current });
      animationRef.current = requestAnimationFrame(updatePhysics);
    };

    animationRef.current = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [tilt]);

  const getEmoji = () => {
    if (status === 'falling') return '🙀';
    if (status === 'climbing') return '🐾';
    return '🐈'; // running
  };

  const getRotation = () => {
    if (status === 'climbing') return dir === 1 ? -90 : 90; // Face up the wall
    return 0; // Flat while running/falling
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        top: `${pos.y}%`,
        left: `${pos.x}%`,
        zIndex: 50,
      }}
      animate={{
         // Wiggle while running/climbing, flat while falling
         rotate: status !== 'falling' ? [getRotation() - 10, getRotation() + 10, getRotation() - 10] : tilt * 2,
      }}
      transition={status !== 'falling' ? { repeat: Infinity, duration: 0.3 } : { type: 'spring' }}
      className={`text-6xl select-none pointer-events-none drop-shadow-2xl filter transition-transform duration-200 ${dir === -1 && status === 'running' ? 'scale-x-[-1]' : ''}`}
    >
      {getEmoji()}
    </motion.div>
  );
}
