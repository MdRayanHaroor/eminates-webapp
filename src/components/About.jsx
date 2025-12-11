import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Globe3D from './Globe3D';

const About = () => {
    return (
        <section id="about" className="py-20 relative overflow-hidden">
             {/* Semi-transparent background panel to ensure readability over particles */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm -z-10"></div>
            
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-premium-dark mb-6">About Eminates</h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            Eminates is a leading fintech solution provider dedicated to revolutionizing the way investors interact with financial institutions. Our mission is to bridge the gap between security and convenience.
                        </p>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            With the Eminates Investor App, we bring transparency and control directly to your fingertips. Whether you are approving requests or tracking your portfolio, our platform ensures your data remains secure while providing a seamless user experience.
                        </p>
                        <div className="flex items-center space-x-4 mt-8">
                            <div className="text-center">
                                <h3 className="text-3xl font-bold text-premium-accent">10k+</h3>
                                <p className="text-sm text-gray-500">Active Users</p>
                            </div>
                            <div className="h-10 w-px bg-gray-300"></div>
                            <div className="text-center">
                                <h3 className="text-3xl font-bold text-premium-accent">$50M+</h3>
                                <p className="text-sm text-gray-500">Securely Managed</p>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* 3D Globe Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2 h-[400px] w-full cursor-move"
                    >
                         <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                            <ambientLight intensity={0.5} />
                            <Suspense fallback={null}>
                                <Globe3D />
                                {/* Allow user to spin the globe */}
                                <OrbitControls 
                                    enableZoom={false} 
                                    autoRotate 
                                    autoRotateSpeed={0.5}
                                    enablePan={false}
                                />
                            </Suspense>
                        </Canvas>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;