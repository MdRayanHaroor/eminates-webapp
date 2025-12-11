import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const Globe3D = (props) => {
  const ref = useRef();
  // Generate points on a sphere surface
  const sphere = random.inSphere(new Float32Array(4000), { radius: 2 });

  useFrame((state, delta) => {
    // Continuous rotation
    ref.current.rotation.y += delta * 0.1;
  });

  return (
    <group rotation={[0, 0, Math.PI / 6]}>
      {/* 1. The Floating Particles (Made slightly darker blue for contrast) */}
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#2563eb" // Vibrant Blue (Blue-600)
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>

      {/* 2. The Inner Wireframe (Replaces the "Grey Blob") */}
      {/* This creates a clean "grid" structure inside the particles */}
      <mesh scale={[1.9, 1.9, 1.9]}>
        <sphereGeometry args={[1, 20, 20]} /> {/* Lower segments = retro tech look */}
        <meshBasicMaterial 
            color="#93c5fd" // Light Blue (Blue-300)
            wireframe={true} // <--- WIREFRAME MODE
            transparent
            opacity={0.5}
        />
      </mesh>
    </group>
  );
};

export default Globe3D;