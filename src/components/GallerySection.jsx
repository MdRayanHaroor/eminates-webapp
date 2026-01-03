import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = [
    { id: 'products', label: 'Products' },
    { id: 'logistics', label: 'Logistics' },
    { id: 'real-estate', label: 'Real Estate' }
];

const galleryData = {
    products: [
        { id: 1, src: 'https://images.unsplash.com/photo-1622666503923-b1d3d63d03ca?q=80&w=600&auto=format&fit=crop', title: 'Bio-Fuels', desc: 'Sustainable energy solutions.' },
        { id: 2, src: 'https://images.unsplash.com/photo-1594924765793-9c8cb1bf0047?q=80&w=600&auto=format&fit=crop', title: 'Briquettes', desc: 'High-density biomass fuel.' },
        { id: 3, src: 'https://images.unsplash.com/photo-1520667086053-90d5718a5996?q=80&w=600&auto=format&fit=crop', title: 'Cocopeat', desc: 'Premium growing medium.' },
        { id: 4, src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb7d5b73?q=80&w=600&auto=format&fit=crop', title: 'Industrial Coal', desc: 'Powering heavy industries.' },
    ],
    logistics: [
        { id: 5, src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop', title: 'Global Transport', desc: 'Efficient worldwide shipping.' },
        { id: 6, src: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop', title: 'Supply Chain', desc: 'Optimized delivery networks.' },
        { id: 7, src: 'https://images.unsplash.com/photo-1494412574643-35d324698420?q=80&w=600&auto=format&fit=crop', title: 'Warehousing', desc: 'Secure storage solutions.' },
    ],
    "real-estate": [
        { id: 8, src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop', title: 'Commercial Towers', desc: 'Modern business hubs.' },
        { id: 9, src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop', title: 'Luxury Apartments', desc: 'Premium living spaces.' },
        { id: 10, src: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=600&auto=format&fit=crop', title: 'Land Development', desc: 'Strategic property investments.' },
        { id: 11, src: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=600&auto=format&fit=crop', title: 'Infrastructure', desc: 'Building the future.' },
    ]
};

const GallerySection = () => {
    const [activeCategory, setActiveCategory] = useState('products');

    return (
        <section id="gallery" className="py-20 bg-gray-50/50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-96 h-96 bg-blue-200/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-96 h-96 bg-purple-200/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-5xl font-bold text-premium-dark mb-4"
                    >
                        Visual Tour
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-gray-600 text-lg max-w-2xl mx-auto"
                    >
                        Explore our diverse portfolio across industries.
                    </motion.p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-1 rounded-full shadow-md inline-flex">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`relative px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 z-10 ${activeCategory === cat.id ? 'text-white' : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {activeCategory === cat.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-premium-dark rounded-full -z-10 shadow-lg"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Gallery Grid */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {galleryData[activeCategory].map((item, index) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4 }}
                                className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer shadow-lg"
                            >
                                <img
                                    src={item.src}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <h3 className="text-white text-xl font-bold translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-300 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                        {item.desc}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default GallerySection;
