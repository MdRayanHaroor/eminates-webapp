import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white backdrop-blur-md shadow-md py-4' : 'bg-white py-4'}`}
        >
            <div className="container mx-auto p-0 flex justify-between items-center">
                {/* <div className="text-2xl font-bold text-premium-dark cursor-pointer" onClick={() => scrollToSection('home')}>
                    Eminates
                </div> */}
                <div className="relative h-10 w-auto flex items-center cursor-pointer" onClick={() => scrollToSection('home')}>
                    <img
                        src="/public/eminates_logo_side.png"
                        alt="Eminates Logo"
                        className="h-16 w-auto max-w-none transform transition-all duration-300 hover:scale-102"
                    />
                </div>
                <div className="hidden md:flex space-x-8 items-center">
                    {['Home', 'Products', 'About', 'App Features'].map((item) => (
                        <motion.button
                            key={item}
                            whileHover={{ scale: 1.1, color: '#5E81AC' }}
                            onClick={() => {
                                let targetId = item.toLowerCase();
                                if (item === 'App Features') targetId = 'features';
                                if (item === 'Products') targetId = 'products';
                                scrollToSection(targetId);
                            }}
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
                {/* Mobile Menu Icon */}
                <div className="md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-premium-dark text-2xl">
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 backdrop-blur-md overflow-hidden mt-2"
                    >
                        <div className="flex flex-col items-center mt-0 py-4 px-0 space-y-2">
                            {['Home', 'Products', 'About', 'App Features'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setTimeout(() => {
                                            let targetId = item.toLowerCase();
                                            if (item === 'App Features') targetId = 'features';
                                            if (item === 'Products') targetId = 'products';
                                            scrollToSection(targetId);
                                        }, 100);
                                    }}
                                    className="text-premium-dark text-lg font-medium hover:text-blue-500 transition-colors"
                                >
                                    {item}
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setTimeout(() => {
                                        scrollToSection('download');
                                    }, 100);
                                }}
                                className="bg-premium-dark text-white px-6 py-2 rounded-full font-semibold hover:bg-premium-accent transition-colors shadow-lg"
                            >
                                Download App
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
