import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaCheckCircle } from 'react-icons/fa';
import slidesData from '../data/business_verticals.json';

const MainBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 7000);
        return () => clearInterval(timer);
    }, [currentSlide]);

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    };

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
    };

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.9
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.9
        })
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            transition: { delay: 0.3 + (custom * 0.1), duration: 0.5 }
        })
    };

    return (
        <div className="relative w-full h-screen min-h-[600px] overflow-hidden bg-gray-900 text-white font-sans">
            {/* Background Image with Overlay */}
            <AnimatePresence initial={false} mode="wait">
                <motion.div
                    key={slidesData[currentSlide].image}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 z-0"
                >
                    <img
                        src={slidesData[currentSlide].image}
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30 md:via-black/60 md:to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Slider Content */}
            <div className="relative z-10 w-full h-full flex items-center">
                <div className="container mx-auto px-4 md:px-8">
                    <AnimatePresence mode='wait' custom={1}>
                        {slidesData[currentSlide].type === 'intro' ? (
                            <motion.div
                                key="intro"
                                className="max-w-4xl mx-auto text-center"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.h1
                                    className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight leading-tight bg-clip-text text-white bg-gradient-to-r from-blue-400 to-purple-400"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.6 }}
                                >
                                    {slidesData[currentSlide].headline}
                                </motion.h1>
                                <motion.div
                                    className="h-1 w-24 bg-blue-500 mx-auto my-6 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: 96 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                />
                                <motion.h2
                                    className="text-xl md:text-3xl font-bold text-blue-400 mb-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {slidesData[currentSlide].subHeadline}
                                </motion.h2>
                                <motion.p
                                    className="text-lg md:text-xl text-gray-300 font-light"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    {slidesData[currentSlide].tagline}
                                </motion.p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={slidesData[currentSlide].id}
                                className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.5 }}
                            >
                                {/* Left Side: Title & Headline */}
                                <div>
                                    <motion.span
                                        className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold mb-4 border border-blue-500/30"
                                        variants={contentVariants}
                                        custom={0}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        Business Vertical
                                    </motion.span>
                                    <motion.h2
                                        className="text-3xl md:text-5xl font-bold mb-2 text-white"
                                        variants={contentVariants}
                                        custom={1}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {slidesData[currentSlide].title}
                                    </motion.h2>
                                    <motion.h3
                                        className="text-xl md:text-2xl text-blue-400 font-medium mb-6"
                                        variants={contentVariants}
                                        custom={2}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {slidesData[currentSlide].headline}
                                    </motion.h3>

                                    <motion.div
                                        className="mb-6"
                                        variants={contentVariants}
                                        custom={3}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <h4 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-3">Core Activities</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {slidesData[currentSlide].activities.map((activity, idx) => (
                                                <span key={idx} className="bg-gray-800 hover:bg-gray-700 transition-colors px-3 py-1 rounded-md text-sm text-gray-200 border border-gray-700">
                                                    {activity}
                                                </span>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Desktop Only Details List */}
                                    <motion.div
                                        className="hidden md:block"
                                        variants={contentVariants}
                                        custom={4}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <h4 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-3">Key Offerings</h4>
                                        <ul className="space-y-2">
                                            {slidesData[currentSlide].basicDetails.map((detail, idx) => (
                                                <li key={idx} className="flex items-start text-gray-300 text-sm md:text-base">
                                                    <FaCheckCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                                                    {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                </div>

                                {/* Right Side: Mobile Details & Visuals */}
                                <div className="md:hidden">
                                    <h4 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-3">Key Offerings</h4>
                                    <ul className="space-y-2">
                                        {slidesData[currentSlide].basicDetails.slice(0, 3).map((detail, idx) => (
                                            <li key={idx} className="flex items-start text-gray-300 text-sm">
                                                <FaCheckCircle className="text-blue-500 mt-1 mr-3 flex-shrink-0" />
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute inset-x-0 bottom-12 z-20 flex justify-between px-4 md:inset-x-auto md:top-1/2 md:-translate-y-1/2 md:w-full md:px-8 pointer-events-none">
                <button
                    onClick={handlePrev}
                    className="pointer-events-auto p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 group"
                >
                    <FaChevronLeft className="text-lg md:text-xl group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                    onClick={handleNext}
                    className="pointer-events-auto p-2 md:p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all hover:scale-110 active:scale-95 group"
                >
                    <FaChevronRight className="text-lg md:text-xl group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {slidesData.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`transition-all duration-300 rounded-full h-2 ${idx === currentSlide ? 'w-8 bg-blue-500' : 'w-2 bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default MainBanner;
