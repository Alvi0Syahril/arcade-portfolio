import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

export interface PlatformConfig {
  ref: React.RefObject<HTMLElement>;
  angle: number; // in degrees
}

interface Props {
  containerRef: React.RefObject<HTMLElement>;
  platforms: PlatformConfig[];
}

export default function PhysicsPlayground({ containerRef, platforms }: Props) {
  const engineRef = useRef<Matter.Engine | null>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current || platforms.some(p => !p.ref.current)) return;

    const engine = Matter.Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    // Cranked-up gravity so the ball accelerates on every ramp tier, not just the first!
    engine.world.gravity.y = 2.0;

    const containerRect = containerRef.current.getBoundingClientRect();
    const cWidth = containerRect.width;
    const cHeight = containerRect.height;

    // Construct Visually-Mapped Slanted Platforms
    platforms.forEach((config) => {
      if (!config.ref.current) return;
      
      // Get standard rotated AABB (Axis-Aligned Bounding Box) for raw positioning
      const rect = config.ref.current.getBoundingClientRect();
      const relativeX = rect.left - containerRect.left + (rect.width / 2);
      const relativeY = rect.top - containerRect.top + (rect.height / 2);
      
      // Bounding client rect gets warped by CSS rotation! We must use offsetWidth/offsetHeight 
      // to extract the true, unrotated geometric dimensions so Matter.js can construct the raw box and rotate it cleanly!
      const rawWidth = config.ref.current.offsetWidth;
      const rawHeight = config.ref.current.offsetHeight;
      
      const body = Matter.Bodies.rectangle(relativeX, relativeY, rawWidth * 0.95, rawHeight * 0.95, {
        isStatic: true,
        angle: config.angle * (Math.PI / 180), // Convert to Radians
        friction: 0.05, // Slippery so the ball cleanly rolls!
      });
      Matter.World.add(world, body);
    });

    // Spawn Coordinates (Top Right Corner above Tier 3)
    const spawnPos = { x: cWidth - 80, y: 150 };
    const ballRadius = 15; // Shrunk ball

    // The Arcade Rolling Sphere!
    const ballBody = Matter.Bodies.circle(spawnPos.x, spawnPos.y, ballRadius, {
      friction: 0.3, // Enough friction so it actually spins visibly when rolling!
      frictionAir: 0.005, // Very slight air drag — barely any resistance
      restitution: 0.3, // Slight bounciness
      density: 0.02,
      // Crank up inertia factor so the spin accumulates fast and looks like genuine momentum
      frictionStatic: 0.5,
    });
    Matter.World.add(world, ballBody);

    // Endless Gameplay Loop + Speed Boost on Lower Tiers
    Matter.Events.on(engine, 'beforeUpdate', () => {
      // Respawn when ball falls off the bottom
      if (ballBody.position.y > cHeight + 50) {
         Matter.Body.setPosition(ballBody, spawnPos);
         Matter.Body.setVelocity(ballBody, { x: 0, y: 0 });
         Matter.Body.setAngularVelocity(ballBody, 0);
      }

      // Speed boost on Orange platform tier (Y > 430)
      if (ballBody.position.y > 430 && ballBody.position.y < 670) {
        if (ballBody.velocity.x < -0.5) {
          Matter.Body.applyForce(ballBody, ballBody.position, { x: -0.003, y: 0 });
        }
      }

      // Speed boost on Blue platform tier (Y > 670)
      if (ballBody.position.y > 670) {
        if (ballBody.velocity.x < -0.5 || Math.abs(ballBody.velocity.x) < 1) {
          Matter.Body.applyForce(ballBody, ballBody.position, { x: -0.005, y: 0 });
        }
      }

      // ---- ROTATION BOOST ----
      // Physics friction alone generates too little angular spin to be visible.
      // We override angular velocity every frame: spin speed = (linear speed / radius) × 2.5x boost.
      // Rolling LEFT (negative vx) → clockwise spin (positive angular vel in Matter.js convention).
      const spinMultiplier = 2.5;
      const targetAngularVelocity = -(ballBody.velocity.x / ballRadius) * spinMultiplier;
      Matter.Body.setAngularVelocity(ballBody, targetAngularVelocity);
    });

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);

    // High performance DOM repainting
    const updateDOM = () => {
      if (ballRef.current && ballBody) {
        ballRef.current.style.transform = `translate(${ballBody.position.x - ballRadius}px, ${ballBody.position.y - ballRadius}px) rotate(${ballBody.angle}rad)`;
      }
      animationFrameId.current = requestAnimationFrame(updateDOM);
    };
    updateDOM();

    return () => {
      Matter.Runner.stop(runner);
      Matter.Engine.clear(engine);
      Matter.World.clear(world, false);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <div 
      ref={ballRef} 
      className="absolute top-0 left-0 z-50 pointer-events-none"
      style={{ willChange: 'transform' }} 
    >
      {/*
        Two-tone half design: top half is vivid neon green, bottom half is dark forest green.
        A single bright white circle pole marker sits at the edge — as Matter.js rotates the
        entire wrapper div, you see that marker orbit the ball like a clock hand. Unmistakably spinning.
      */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        style={{
          filter: 'drop-shadow(0 0 8px #A6E22E) drop-shadow(0 0 3px #fff)',
          overflow: 'visible',
        }}
      >
        {/* Bottom half — dark */}
        <path d="M 1 16 A 15 15 0 0 0 31 16 Z" fill="#1a3a1a" />
        {/* Top half — vivid neon green */}
        <path d="M 1 16 A 15 15 0 0 1 31 16 Z" fill="#A6E22E" />
        {/* Equator dividing line */}
        <line x1="1" y1="16" x2="31" y2="16" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        {/* Outer ring */}
        <circle cx="16" cy="16" r="15" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
        {/* Pole marker dot — orbits the ball as it rotates */}
        <circle cx="16" cy="3" r="3" fill="white" opacity="0.95" />
      </svg>
    </div>
  );
}
