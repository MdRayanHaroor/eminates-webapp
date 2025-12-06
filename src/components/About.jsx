import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <section id="about" className="py-20 bg-white overflow-hidden">
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
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="md:w-1/2"
                    >
                        <div className="rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                            {/* Placeholder for About Image */}
                            <div className="w-full h-80 bg-gray-200 flex items-center justify-center text-gray-400 text-xl font-medium">
                                Office / Team Image
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
