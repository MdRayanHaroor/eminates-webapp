import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Environment, PresentationControls, Float, ContactShadows } from '@react-three/drei';
import Phone3D from './Phone3D';

const Hero = () => {
    const scrollToDownload = () => {
        const element = document.getElementById('download');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="home" className="min-h-screen flex items-center pt-20 overflow-hidden relative">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white z-0 pointer-events-none"></div>

            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center relative z-10">
                
                {/* Text Content */}
                <div className="md:w-1/2 mb-10 md:mb-0 pointer-events-none md:pointer-events-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-6xl font-bold text-premium-dark leading-tight mb-6"
                    >
                        Secure Investment <br />
                        <span className="text-premium-accent">Simplified.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="text-lg text-gray-600 mb-8 max-w-lg"
                    >
                        Experience the future of secure investment requests with the Eminates Investor App. Streamlined, secure, and built for you.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        className="flex space-x-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={scrollToDownload}
                            className="bg-premium-dark text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-premium-accent transition-colors shadow-xl cursor-pointer pointer-events-auto"
                        >
                            Get the App
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 rounded-full font-bold text-lg text-premium-dark border-2 border-premium-dark hover:bg-premium-dark hover:text-white transition-all cursor-pointer pointer-events-auto"
                        >
                            Learn More
                        </motion.button>
                    </motion.div>
                </div>

                {/* 3D Interactive Scene */}
                <div className="md:w-1/2 h-[600px] w-full relative flex items-center justify-center cursor-grab active:cursor-grabbing">
                    <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[10, 10, 5]} intensity={1.5} />
                        <Suspense fallback={null}>
                            <Environment preset="city" />
                            
                            {/* Controls: Removed 'snap' prop to fix disappearing bug */}
                            <PresentationControls
                                global={false}
                                config={{ mass: 2, tension: 500 }}
                                rotation={[0, 0.3, 0]}
                                polar={[-Math.PI / 4, Math.PI / 4]} 
                                azimuth={[-Math.PI / 3, Math.PI / 3]}
                            >
                                {/* Safe Floating Wrapper */}
                                <Float rotationIntensity={0.5} floatIntensity={0.5} speed={2}>
                                    <Phone3D />
                                </Float>
                            </PresentationControls>
                            
                            <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2.5} far={4.5} />
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        </section>
    );
};

export default Hero;