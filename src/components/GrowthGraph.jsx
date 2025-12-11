import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { RoundedBox, Text, Float } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';

const Bar = ({ position, height, label, color, delay }) => {
  const [active, setActive] = useState(false);

  // Spring animation for smooth growth
  const { scaleY, colorSpring } = useSpring({
    scaleY: active ? 1.5 : 1, // Grow 1.5x on hover
    colorSpring: active ? "#10b981" : color, // Turn green on hover
    config: { tension: 300, friction: 10 }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
        <animated.mesh 
          scale-y={scaleY}
          onPointerOver={() => setActive(true)}
          onPointerOut={() => setActive(false)}
          position={[0, height / 2, 0]} // Pivot from bottom
        >
          {/* Industrial Cylinder/Pipe look */}
          <cylinderGeometry args={[0.3, 0.3, height, 32]} />
          <animated.meshStandardMaterial color={colorSpring} metalness={0.8} roughness={0.2} />
        </animated.mesh>
      </Float>

      {/* Label at bottom */}
      <Text position={[0, -0.5, 0]} fontSize={0.25} color="#333" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  );
};

const GrowthGraph = () => {
  return (
    <div className="h-[400px] w-full">
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, 5, -5]} color="#10b981" intensity={2} />

        <group position={[-2, -1, 0]}>
            {/* Bar 1: Manufacturing */}
            <Bar position={[0, 0, 0]} height={2} label="MNF" color="#64748b" />
            
            {/* Bar 2: Bio-Fuels */}
            <Bar position={[1.5, 0, 0]} height={3} label="BIO" color="#64748b" />
            
            {/* Bar 3: Growth */}
            <Bar position={[3, 0, 0]} height={4.5} label="GRO" color="#64748b" />
            
            {/* Bar 4: Profit */}
            <Bar position={[4.5, 0, 0]} height={3.5} label="PRF" color="#64748b" />
        </group>
      </Canvas>
    </div>
  );
};

export default GrowthGraph;