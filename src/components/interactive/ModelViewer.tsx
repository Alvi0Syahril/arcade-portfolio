import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';

const COLORS = ['#32CD32', '#FF0055', '#00D2FF', '#FFB000', '#AA00FF'];

// An animated geometric placeholder for the 3D model
function SpinningPlaceholder() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [colorIdx, setColorIdx] = useState(0);

  // Spin the model and follow the cursor smoothly
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Continuous rotation
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      
      // Cursor tracking (state.pointer goes from -1 to 1)
      const targetX = (state.pointer.x * state.viewport.width) / 4;
      const targetY = (state.pointer.y * state.viewport.height) / 4;
      
      // Lerp for smooth flying effect
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <mesh 
        ref={meshRef} 
        castShadow 
        receiveShadow
        onClick={() => setColorIdx((prev) => (prev + 1) % COLORS.length)}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        {/* Smaller geometry */}
        <icosahedronGeometry args={[0.8, 0]} />
        <MeshDistortMaterial
          color={COLORS[colorIdx]}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.8}
          roughness={0.2}
          distort={0.4}
          speed={3}
        />
      </mesh>
    </Float>
  );
}

export default function ModelViewer() {
  return (
    <div className="w-full max-w-2xl mx-auto h-[300px] relative rounded-2xl overflow-hidden glass-panel border border-electric-blue/30 shadow-2xl z-10">
      {/* Decorative label */}
      <div className="absolute top-4 left-6 z-20 flex flex-col">
        <span className="font-mono text-sm text-electric-blue tracking-widest uppercase">
          Interactive Data Node
        </span>
        <span className="font-mono text-xs text-hero-text/60 mt-1">
          &gt; Move mouse to attract. Click to cycle color.
        </span>
      </div>

      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <spotLight position={[-10, -10, -5]} intensity={1} color="#00FF00" />
        
        <SpinningPlaceholder />

        {/* Studio environment for realistic reflections */}
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
