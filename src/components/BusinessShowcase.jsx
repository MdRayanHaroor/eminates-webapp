import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaIndustry, FaBuilding, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const BusinessShowcase = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slides = [
        {
            id: 1,
            title: "Alhan Bio Fuels",
            subtitle: "Powering Industries, Preserving Nature",
            link: "https://www.alhanbiofuels.com",
            icon: <img src="/alhan-bio-fuels-icon.png" alt="Alhan Bio Fuels" className="w-13 h-13 object-contain mb-0" />,
            content: (
                <div className="space-y-4">
                    <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-premium-dark mb-2">Company Overview</h4>
                        <p className="text-gray-600">Established in 2014, Alhan Bio Fuels is a premier manufacturer and global exporter of renewable fuel solutions.</p>
                    </div>
                    <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-premium-dark mb-2">Mission</h4>
                        <p className="text-gray-600">Driving the global transition toward sustainable energy through innovation and ISO-certified biomass products.</p>
                    </div>
                    <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-premium-dark mb-2">Global Reach</h4>
                        <p className="text-gray-600">Actively serving over 45 customers across three countries, including the UK and European markets.</p>
                    </div>
                    <div className="mt-4 text-sm text-gray-500">
                        <p><span className="font-semibold text-gray-700">Head Office:</span> Vaniyambadi, Tirupattur District, Tamil Nadu.</p>
                        <p><span className="font-semibold text-gray-700">Manufacturing Unit:</span> SIPCOT Industrial Park, Krishnagiri District, Tamil Nadu.</p>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "Core Products",
            subtitle: "Briquettes, Cocopeat, and Coal",
            icon: <FaIndustry className="text-4xl text-black mb-0" />,
            content: (
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-lg font-bold text-indigo-600 mb-2">Biomass Briquettes</h4>
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                            <li><span className="font-semibold text-gray-700">Industrial:</span> High-density 70mm/90mm for power plants & boilers.</li>
                            <li><span className="font-semibold text-gray-700">Domestic:</span> 6mm/8mm pellets for heating & cooking.</li>
                        </ul>
                    </div>
                    <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-lg font-bold text-indigo-600 mb-2">Cocopeat Solutions</h4>
                        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                            <li><span className="font-semibold text-gray-700">Variants:</span> Low EC (seedlings) & High EC (salt-tolerant).</li>
                            <li><span className="font-semibold text-gray-700">Applications:</span> Horticulture, hydroponics & greenhouses.</li>
                        </ul>
                    </div>
                    <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                        <h4 className="text-lg font-bold text-indigo-600 mb-2">Industrial Coal & Carbon Trading</h4>
                        <p className="text-gray-600 text-sm">Strategic trader of Indonesian thermal coal, Pet Coke, and Met Coke. Supplier of premium Activated Carbon.</p>
                    </div>
                </div>
            )
        },
        {
            id: 3,
            title: "Real Estate & Diversified Interests",
            subtitle: "Expanding Horizons",
            icon: <FaBuilding className="text-4xl text-blue-600 mb-0" />,
            content: (
                <div className="space-y-4">
                    <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-blue-600 mb-2">Sector Diversification</h4>
                        <p className="text-gray-600">Leadership manages a growing portfolio in the Real Estate sector, leveraging over a decade of experience.</p>
                    </div>
                    <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-blue-600 mb-2">Integrated Business Model</h4>
                        <p className="text-gray-600">Combining technical consultation, logistics management, and industrial infrastructure to support multi-sector growth.</p>
                    </div>
                    <div className="bg-white/60 p-4 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-md transition-shadow">
                        <h4 className="text-xl font-bold text-blue-600 mb-2">Vision</h4>
                        <p className="text-gray-600">Expanding footprint through diversified investments while maintaining commitment to sustainability.</p>
                    </div>
                </div>
            )
        }
    ];

    useEffect(() => {
        let timer;
        if (!isPaused) {
            timer = setInterval(() => {
                handleNext();
            }, 8000);
        }
        return () => clearInterval(timer);
    }, [currentIndex, isPaused]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <section id="our-businesses" className="py-20 relative overflow-hidden">
            <div className="container mx-auto px-4 z-10 relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-premium-dark mb-4">
                        Our Businesses
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Discover the diverse portfolio and sustainable initiatives that drive our growth and value for investors.
                    </p>
                </motion.div>

                <div
                    className="relative max-w-5xl mx-auto"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Slider Container */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 p-6 md:p-12 shadow-2xl min-h-[600px] flex flex-col justify-center relative overflow-hidden group">
                        {/* Glossy shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5 }}
                                className="w-full relative z-10"
                            >
                                <div className="flex flex-col items-center text-center mb-8">
                                    {slides[currentIndex].link ? (
                                        <a
                                            href={slides[currentIndex].link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex flex-col items-center px-4 py-2 rounded-xl hover:bg-white/50 transition-colors cursor-pointer"
                                        >
                                            <div className="w-16 h-16 bg-premium-light rounded-xl flex items-center justify-center mb-4 text-2xl shadow-inner overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                                {typeof slides[currentIndex].icon === 'string' ? (
                                                    <span>{slides[currentIndex].icon}</span>
                                                ) : (
                                                    slides[currentIndex].icon
                                                )}
                                            </div>
                                            <h3 className="text-3xl font-bold text-premium-dark mb-2 group-hover:text-emerald-700 transition-colors flex items-center gap-2">
                                                {slides[currentIndex].title}
                                                {/* <span className="text-sm opacity-0 group-hover:opacity-100 transition-opacity">↗</span> */}
                                            </h3>
                                        </a>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-premium-light rounded-xl flex items-center justify-center mb-4 text-2xl shadow-inner overflow-hidden">
                                                {typeof slides[currentIndex].icon === 'string' ? (
                                                    <span>{slides[currentIndex].icon}</span>
                                                ) : (
                                                    slides[currentIndex].icon
                                                )}
                                            </div>
                                            <h3 className="text-3xl font-bold text-premium-dark mb-2">{slides[currentIndex].title}</h3>
                                        </>
                                    )}
                                    <p className="text-emerald-600 font-medium text-lg">{slides[currentIndex].subtitle}</p>
                                </div>

                                <div className="text-left">
                                    {slides[currentIndex].content}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Controls */}
                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 relative z-10">
                            <button
                                onClick={handlePrev}
                                className="p-3 rounded-full bg-gray-100 hover:bg-white text-gray-600 hover:text-premium-dark transition-all border border-gray-200 hover:border-emerald-500/30 shadow-sm group"
                            >
                                <FaChevronLeft className="group-hover:text-emerald-600 transition-colors" />
                            </button>

                            <div className="flex space-x-2">
                                {slides.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-premium-accent' : 'w-2 bg-gray-300 hover:bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                className="p-3 rounded-full bg-gray-100 hover:bg-white text-gray-600 hover:text-premium-dark transition-all border border-gray-200 hover:border-emerald-500/30 shadow-sm group"
                            >
                                <FaChevronRight className="group-hover:text-emerald-600 transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BusinessShowcase;
