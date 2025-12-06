import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

const Modal = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h3 className="text-2xl font-bold text-premium-dark">{title}</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-premium-dark"
                                >
                                    <IoClose size={24} />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <div className="prose prose-sm max-w-none text-gray-600">
                                    {children}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="bg-premium-dark text-white px-6 py-2 rounded-lg font-semibold hover:bg-premium-accent transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default Modal;
