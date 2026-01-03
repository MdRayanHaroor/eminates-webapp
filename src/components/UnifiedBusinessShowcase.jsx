import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaIndustry, FaBuilding, FaGlobeAmericas, FaLeaf, FaArrowRight } from 'react-icons/fa';

const categories = [
    { id: 'bio-fuels', label: 'Alhan Bio Fuels', icon: <FaLeaf /> },
    { id: 'logistics', label: 'Logistics & Global Reach', icon: <FaGlobeAmericas /> },
    { id: 'real-estate', label: 'Real Estate', icon: <FaBuilding /> }
];

// Content Data merging BusinessShowcase text and Gallery images
const contentData = {
    "bio-fuels": {
        title: "Energy & Sustainability",
        subtitle: "Powering Industries, Preserving Nature",
        description: "Established in 2014, Alhan Bio Fuels is a premier manufacturer and global exporter of renewable fuel solutions. We drive the global transition toward sustainable energy.",
        stats: [
            { label: "Established", value: "2014" },
            { label: "Products", value: "ISO Certified" }
        ],
        details: [
            { title: "Biomass Briquettes", text: "High-density 70mm/90mm for power plants & boilers." },
            { title: "Cocopeat Solutions", text: "Low & High EC variants for horticulture & hydroponics." },
            { title: "Industrial Coal", text: "Strategic trading of Indonesian thermal coal & pet coke." }
        ],
        images: [
            { id: 1, src: 'https://images.unsplash.com/photo-1622666503923-b1d3d63d03ca?q=80&w=600&auto=format&fit=crop', title: 'Bio-Fuels', desc: 'Sustainable energy.' },
            { id: 2, src: 'https://images.unsplash.com/photo-1594924765793-9c8cb1bf0047?q=80&w=600&auto=format&fit=crop', title: 'Briquettes', desc: 'High-density fuel.' },
            { id: 3, src: 'https://images.unsplash.com/photo-1520667086053-90d5718a5996?q=80&w=600&auto=format&fit=crop', title: 'Cocopeat', desc: 'Premium growing medium.' }
        ]
    },
    "logistics": {
        title: "Global Operations",
        subtitle: "Efficient Supply Chain Management",
        description: "Actively serving over 45 customers across three countries, including the UK and European markets. We ensure seamless logistics from manufacturing to delivery.",
        stats: [
            { label: "Countries", value: "3+" },
            { label: "Customers", value: "45+" }
        ],
        details: [
            { title: "Global Transport", text: "Efficient worldwide shipping network." },
            { title: "Warehousing", text: "Secure storage and inventory management." },
            { title: "Integrated Model", text: "Combining technical consultation with logistics." }
        ],
        images: [
            { id: 5, src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop', title: 'Global Transport', desc: 'Worldwide shipping.' },
            { id: 6, src: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=600&auto=format&fit=crop', title: 'Supply Chain', desc: 'Optimized networks.' },
            { id: 7, src: 'https://images.unsplash.com/photo-1494412574643-35d324698420?q=80&w=600&auto=format&fit=crop', title: 'Warehousing', desc: 'Secure storage.' },
        ]
    },
    "real-estate": {
        title: "Real Estate Development",
        subtitle: "Building the Future",
        description: "Leveraging over a decade of experience to manage a growing portfolio in the Real Estate sector. We focus on strategic property investments and infrastructure.",
        stats: [
            { label: "Experience", value: "10+ Years" },
            { label: "Portfolio", value: "Growing" }
        ],
        details: [
            { title: "Commercial Towers", text: "Modern business hubs and office spaces." },
            { title: "Luxury Living", text: "Premium apartments and residential complexes." },
            { title: "Land Development", text: "Strategic planning and infrastructure." }
        ],
        images: [
            { id: 8, src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop', title: 'Commercial', desc: 'Business hubs.' },
            { id: 9, src: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=600&auto=format&fit=crop', title: 'Residential', desc: 'Luxury living.' },
            { id: 10, src: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=600&auto=format&fit=crop', title: 'Development', desc: 'Strategic investment.' },
        ]
    }
};

const UnifiedBusinessShowcase = () => {
    const [activeTab, setActiveTab] = useState('bio-fuels');

    return (
        <section id="our-businesses" className="py-24 relative overflow-hidden bg-gray-50/50">
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-premium-accent/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-premium-dark mb-4"
                    >
                        Our Businesses
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 text-lg max-w-2xl mx-auto"
                    >
                        A diversified portfolio driving value through innovation and sustainability.
                    </motion.p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-medium transition-all duration-300 relative ${activeTab === cat.id
                                    ? 'text-white shadow-lg shadow-premium-accent/25'
                                    : 'text-gray-600 hover:text-premium-dark hover:bg-white/80'
                                }`}
                        >
                            {activeTab === cat.id && (
                                <motion.div
                                    layoutId="activePill"
                                    className="absolute inset-0 bg-premium-dark rounded-full -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="text-lg">{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="grid md:grid-cols-2 gap-12 items-center"
                    >
                        {/* Left Column: Info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-3xl font-bold text-premium-dark mb-2">
                                    {contentData[activeTab].title}
                                </h3>
                                <p className="text-xl text-premium-accent font-medium mb-4">
                                    {contentData[activeTab].subtitle}
                                </p>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {contentData[activeTab].description}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="flex gap-8 border-y border-gray-200 py-6">
                                {contentData[activeTab].stats.map((stat, idx) => (
                                    <div key={idx}>
                                        <div className="text-2xl font-bold text-premium-dark">{stat.value}</div>
                                        <div className="text-sm text-gray-500 uppercase tracking-wide">{stat.label}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Details List */}
                            <div className="grid gap-4">
                                {contentData[activeTab].details.map((item, idx) => (
                                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <h4 className="font-bold text-premium-dark flex items-center gap-2">
                                            <FaIndustry className="text-premium-accent text-sm" />
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-1">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Visuals (Max 3 Images) */}
                        <div className="grid grid-cols-1 gap-4">
                            {/* Main Featured Image */}
                            <motion.div
                                className="relative rounded-2xl overflow-hidden shadow-2xl aspect-video group"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <img
                                    src={contentData[activeTab].images[0].src}
                                    alt={contentData[activeTab].images[0].title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                                    <div>
                                        <h4 className="text-white font-bold text-xl">{contentData[activeTab].images[0].title}</h4>
                                        <p className="text-gray-200 text-sm">{contentData[activeTab].images[0].desc}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Two smaller images below */}
                            <div className="grid grid-cols-2 gap-4">
                                {contentData[activeTab].images.slice(1, 3).map((img, idx) => (
                                    <motion.div
                                        key={img.id}
                                        className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] group"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.3 + (idx * 0.1) }}
                                    >
                                        <img
                                            src={img.src}
                                            alt={img.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="text-center p-2">
                                                <p className="text-white font-bold text-sm">{img.title}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
};

export default UnifiedBusinessShowcase;
