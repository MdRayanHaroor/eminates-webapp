import React from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    const scrollToDownload = () => {
        const element = document.getElementById('download');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="home" className="min-h-screen flex items-center pt-20 bg-gradient-to-b from-premium-light to-white overflow-hidden">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0 z-10">
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
                            className="bg-premium-dark text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-premium-accent transition-colors shadow-xl"
                        >
                            Get the App
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-3 rounded-full font-bold text-lg text-premium-dark border-2 border-premium-dark hover:bg-premium-dark hover:text-white transition-all"
                        >
                            Learn More
                        </motion.button>
                    </motion.div>
                </div>
                <div className="md:w-1/2 flex justify-center relative">
                    {/* Phone Mockup with Floating Animation */}
                    <motion.div
                        initial={{ opacity: 0, x: 50, rotate: -5 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            rotate: 0,
                            y: [0, -20, 0] // Floating animation
                        }}
                        transition={{
                            opacity: { duration: 1, delay: 0.2, ease: "easeOut" },
                            x: { duration: 1, delay: 0.2, ease: "easeOut" },
                            rotate: { duration: 1, delay: 0.2, ease: "easeOut" },
                            y: { duration: 4, repeat: Infinity, ease: "easeInOut" } // Continuous floating
                        }}
                        className="relative w-72 h-[500px] bg-premium-dark rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden z-10"
                    >
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-800 rounded-b-xl z-10"></div>

                        {/* Screen Content - Gradient representing Login Screen */}
                        <div className="w-full h-full bg-gradient-to-br from-premium-accent to-blue-900 flex flex-col items-center justify-center relative">
                            {/* Subtle overlay pattern or logo placeholder */}
                            <div className="w-20 h-20 bg-white/10 rounded-full blur-xl absolute top-1/4 left-1/4"></div>
                            <div className="w-32 h-32 bg-white/5 rounded-full blur-2xl absolute bottom-1/3 right-1/4"></div>

                            {/* Mock Login Fields */}
                            <div className="w-48 h-3 bg-white/20 rounded-full mb-4"></div>
                            <div className="w-48 h-10 bg-white/10 rounded-lg mb-3 border border-white/10"></div>
                            <div className="w-48 h-10 bg-white/10 rounded-lg mb-6 border border-white/10"></div>
                            <div className="w-48 h-10 bg-premium-accent rounded-lg shadow-lg"></div>
                        </div>
                    </motion.div>

                    {/* Decorative elements */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -z-10 top-1/2 right-10 w-72 h-72 bg-premium-accent/20 rounded-full blur-3xl"
                    ></motion.div>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute -z-10 bottom-0 left-10 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"
                    ></motion.div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
