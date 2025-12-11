import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const Phone3D = () => {
  const phoneRef = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useFrame((state, delta) => {
    if (!phoneRef.current) return;

    // Fade In / Scale Animation
    // We smoothly interpolate the scale from 0 to 1
    const currentScale = phoneRef.current.scale.x;
    const targetScale = mounted ? 1 : 0;
    
    // Calculate the step towards the target
    let step = (targetScale - currentScale) * (delta * 4); // Speed factor 4

    // Apply the scale if we aren't there yet
    if (Math.abs(targetScale - currentScale) > 0.001) {
        const newScale = currentScale + step;
        phoneRef.current.scale.setScalar(newScale);
    } else if (currentScale !== targetScale) {
        // Snap to exact target to stop calculating
        phoneRef.current.scale.setScalar(targetScale);
    }
    
    // NOTE: We removed the manual position/rotation math here to prevent 
    // conflicts with the drag controls in Hero.jsx
  });

  return (
    <group ref={phoneRef} scale={[0,0,0]}>
      {/* Phone Body */}
      <RoundedBox args={[3, 6, 0.4]} radius={0.3} smoothness={4}>
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.8} />
      </RoundedBox>

      {/* Screen Container */}
      <RoundedBox args={[2.85, 5.85, 0.05]} radius={0.2} smoothness={4} position={[0, 0, 0.2]}>
        <meshPhysicalMaterial 
            color="#000" 
            roughness={0.2} 
            metalness={0.1}
            clearcoat={1}
        />
      </RoundedBox>

      {/* Screen UI Content */}
      <mesh position={[0, 0, 0.23]}>
        <planeGeometry args={[2.7, 5.7]} />
        <meshBasicMaterial>
           <canvasTexture
              attach="map"
              image={(() => {
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 1024;
                const ctx = canvas.getContext('2d');
                
                // Gradient Background
                const gradient = ctx.createLinearGradient(0, 0, 512, 1024);
                gradient.addColorStop(0, '#1e3a8a'); 
                gradient.addColorStop(1, '#3b82f6'); 
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, 512, 1024);

                // UI Circles (Abstract visuals)
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.beginPath();
                ctx.arc(256, 300, 100, 0, Math.PI * 2);
                ctx.fill();

                // UI Bars
                ctx.fillStyle = 'rgba(255,255,255,0.2)';
                ctx.roundRect(106, 500, 300, 40, 20);
                ctx.fill();
                ctx.roundRect(106, 560, 300, 40, 20);
                ctx.fill();
                
                // Action Button
                ctx.fillStyle = '#10b981'; 
                ctx.roundRect(106, 650, 300, 60, 30);
                ctx.fill();
                
                return canvas;
              })()}
           />
        </meshBasicMaterial>
      </mesh>

      <pointLight position={[0, 1, 2]} intensity={2} color="#ffffff" distance={5} />
    </group>
  );
};

export default Phone3D;