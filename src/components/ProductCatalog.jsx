import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCheckCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import productsData from '../data/product_details.json';

// Sub-component for rendering the thumbnail image (single or auto-scrolling array)
const ProductThumbnail = ({ image, name }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const isArray = Array.isArray(image);

    useEffect(() => {
        if (!isArray || image.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % image.length);
        }, 3000); // Auto-scroll every 3 seconds

        return () => clearInterval(interval);
    }, [isArray, image]);

    const currentSrc = isArray ? image[currentImageIndex] : image;

    return (
        <AnimatePresence mode='wait'>
            <motion.img
                key={currentSrc}
                src={currentSrc}
                alt={name}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0.8 }}
                transition={{ duration: 0.5 }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
        </AnimatePresence>
    );
};

const ProductCatalog = () => {
    const [filter, setFilter] = useState('Bio Fuels');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    const categories = ['Bio Fuels', 'Chemicals', 'Electric & Electronics', 'Mechanical', 'Oil & Lubricants', 'Pipes & Fittings', 'Real-estate & construction', 'Solar', 'Industrial Water & Wastewater Solutions'];

    // Close modal on ESC key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setSelectedProduct(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Reset modal image index when a new product is selected
    useEffect(() => {
        setModalImageIndex(0);
    }, [selectedProduct]);

    const filteredProducts = productsData.filter(product => {
        return product.category === filter;
    });

    const handleNextImage = (e, images) => {
        e.stopPropagation();
        setModalImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrevImage = (e, images) => {
        e.stopPropagation();
        setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <section className="py-20 bg-gray-50 text-gray-900" id="products">
            <div className="container mx-auto px-4 md:px-8">

                {/* Section Header */}
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-5xl font-bold bg-clip-text text-black bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
                    >
                        Our Products
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-600 text-lg max-w-2xl mx-auto"
                    >
                        Explore our extensive range of industrial supplies tailored for efficiency and performance.
                    </motion.p>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category, idx) => (
                        <motion.button
                            key={category}
                            onClick={() => setFilter(category)}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm border
                                ${filter === category
                                    ? 'bg-blue-600 text-white shadow-blue-500/30 shadow-lg border-blue-600'
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
                                }
                            `}
                        >
                            {category}
                        </motion.button>
                    ))}
                </div>

                {/* Product Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1 border border-gray-100"
                            >
                                {/* Image Container */}
                                <div className="relative h-64 overflow-hidden">
                                    <ProductThumbnail image={product.image} name={product.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                                    {/* Category Badge */}
                                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-blue-600 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        {product.category}
                                    </span>

                                    {/* Title Overlay */}
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-xl font-bold text-white leading-tight mb-1">{product.name}</h3>
                                        <p className="text-gray-200 text-sm font-medium line-clamp-1">{product.purpose}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Product Detail Modal */}
                <AnimatePresence>
                    {selectedProduct && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            onClick={() => setSelectedProduct(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
                            >
                                {/* Modal Image Area */}
                                <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-100 group">
                                    <AnimatePresence mode='wait'>
                                        <motion.img
                                            key={Array.isArray(selectedProduct.image) ? selectedProduct.image[modalImageIndex] : selectedProduct.image}
                                            src={Array.isArray(selectedProduct.image) ? selectedProduct.image[modalImageIndex] : selectedProduct.image}
                                            alt={selectedProduct.name}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="w-full h-full object-cover"
                                        />
                                    </AnimatePresence>

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:hidden pointer-events-none" />

                                    {/* Close Button Mobile */}
                                    <button
                                        onClick={() => setSelectedProduct(null)}
                                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white md:hidden transition-colors z-20"
                                    >
                                        <FaTimes />
                                    </button>

                                    {/* Slider Controls */}
                                    {Array.isArray(selectedProduct.image) && selectedProduct.image.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => handlePrevImage(e, selectedProduct.image)}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-md p-3 rounded-full text-white transition-all z-20"
                                            >
                                                <FaChevronLeft />
                                            </button>
                                            <button
                                                onClick={(e) => handleNextImage(e, selectedProduct.image)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 backdrop-blur-md p-3 rounded-full text-white transition-all z-20"
                                            >
                                                <FaChevronRight />
                                            </button>

                                            {/* Dots Indicator */}
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                                {selectedProduct.image.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`w-2 h-2 rounded-full transition-all shadow-sm ${idx === modalImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Modal Content */}
                                <div className="w-full md:w-1/2 p-8 overflow-y-auto relative bg-white">
                                    {/* Close Button Desktop */}
                                    <button
                                        onClick={() => setSelectedProduct(null)}
                                        className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors hidden md:block text-xl"
                                    >
                                        <FaTimes />
                                    </button>

                                    <span className="inline-block bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                                        {selectedProduct.category}
                                    </span>

                                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h3>

                                    {/* Material Badge */}
                                    {selectedProduct.material && (
                                        <div className="mb-4">
                                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Material: </span>
                                            <span className="text-gray-800 font-medium">{selectedProduct.material}</span>
                                        </div>
                                    )}

                                    <p className="text-gray-600 text-lg mb-6 leading-relaxed border-l-4 border-blue-500 pl-4 bg-blue-50 py-2 rounded-r-lg">
                                        {selectedProduct.purpose}
                                    </p>


                                    <div className="space-y-6">
                                        {/* Sub Products / Products Covered */}
                                        {selectedProduct.sub_products && (
                                            <div>
                                                <h4 className="text-gray-900 font-bold mb-3 flex items-center text-md">
                                                    Products Covered
                                                </h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProduct.sub_products.map((sub, idx) => (
                                                        <span key={idx} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-md border border-gray-200">
                                                            {sub}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Features */}
                                        {selectedProduct.features && (
                                            <div>
                                                <h4 className="text-gray-900 font-bold mb-3 flex items-center text-md">
                                                    Key Features
                                                </h4>
                                                <ul className="grid grid-cols-1 gap-2">
                                                    {selectedProduct.features.map((feature, idx) => (
                                                        <li key={idx} className="flex items-center text-sm text-gray-700">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></div>
                                                            {feature}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Usage */}
                                        {selectedProduct.usages && (
                                            <div>
                                                <h4 className="text-gray-900 font-bold mb-3 flex items-center text-md">
                                                    Applications
                                                </h4>
                                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {selectedProduct.usages.map((usage, idx) => (
                                                        <li key={idx} className="flex items-start text-sm text-gray-700">
                                                            <FaCheckCircle className="text-green-500 mt-0.5 mr-2 flex-shrink-0 text-xs" />
                                                            <span>{usage}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}

                                        {/* Packing & Solutions Grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                            {selectedProduct.packing && (
                                                <div>
                                                    <h4 className="text-gray-900 font-bold mb-2 text-sm uppercase text-gray-500">Packing</h4>
                                                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                        {typeof selectedProduct.packing === 'object' ? (
                                                            <>
                                                                <div className="mb-1"><span className="font-semibold">Bulk:</span> {selectedProduct.packing.bulk}</div>
                                                                <div><span className="font-semibold">Small:</span> {selectedProduct.packing.small}</div>
                                                            </>
                                                        ) : (
                                                            selectedProduct.packing
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {selectedProduct.solutions && (
                                                <div>
                                                    <h4 className="text-gray-900 font-bold mb-2 text-sm uppercase text-gray-500">Solutions</h4>
                                                    <ul className="text-sm text-gray-700 bg-blue-50/50 p-3 rounded-lg space-y-1">
                                                        {selectedProduct.solutions.map((sol, idx) => (
                                                            <li key={idx} className="flex items-start">
                                                                <span className="text-blue-500 mr-2">✔</span> {sol}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );

};

export default ProductCatalog;
