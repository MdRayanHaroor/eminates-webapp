import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const RisingBubbles = () => {
  const ref = useRef();
  const count = 4000;
  
  // Generate random positions
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // X and Z are random (width/depth)
      pos[i * 3] = (Math.random() - 0.5) * 10;     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10; // y (height)
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
      
      // Random speed for each bubble
      spd[i] = Math.random() * 0.02 + 0.005;
    }
    return [pos, spd];
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    
    // Access the position attribute
    const positionsArray = ref.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      // Move Y position up
      positionsArray[i * 3 + 1] += speeds[i];

      // If bubble goes too high, reset to bottom
      if (positionsArray[i * 3 + 1] > 4) {
        positionsArray[i * 3 + 1] = -4;
      }
    }
    
    // Tell Three.js the positions updated
    ref.current.geometry.attributes.position.needsUpdate = true;
    
    // Slow rotation of the whole system
    ref.current.rotation.y += 0.001;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#10b981" // Emerald Green (Bio-fuel color)
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  );
};

const BioBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-slate-900">
      {/* Background Gradient simulating liquid container */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-emerald-900/20 to-slate-900"></div>
      
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <RisingBubbles />
      </Canvas>
    </div>
  );
};

export default BioBackground;