import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'}`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="text-2xl font-bold text-premium-dark cursor-pointer" onClick={() => scrollToSection('home')}>
                    Eminates
                </div>
                <div className="hidden md:flex space-x-8 items-center">
                    {['Home', 'About', 'App Features'].map((item) => (
                        <motion.button
                            key={item}
                            whileHover={{ scale: 1.1, color: '#5E81AC' }}
                            onClick={() => scrollToSection(item === 'App Features' ? 'features' : item.toLowerCase())}
                            className="text-premium-dark transition-colors font-medium"
                        >
                            {item}
                        </motion.button>
                    ))}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => scrollToSection('download')}
                        className="bg-premium-dark text-white px-6 py-2 rounded-full font-semibold hover:bg-premium-accent transition-colors shadow-lg"
                    >
                        Download App
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
