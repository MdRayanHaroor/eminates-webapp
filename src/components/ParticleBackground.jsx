import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const Stars = (props) => {
  const ref = useRef();
  // Reduce count slightly for performance, increase radius
  const sphere = random.inSphere(new Float32Array(3000), { radius: 1.2 });

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 15;
    ref.current.rotation.y -= delta / 20;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#1e3a8a" // Dark Blue
          size={0.003} // Slightly larger size for visibility
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const ParticleBackground = () => {
  return (
    // Hardcoded bg-blue-50/20 or similar to ensure it's not transparent to body
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#f8fafc]"> 
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Stars />
      </Canvas>
    </div>
  );
};

export default ParticleBackground;