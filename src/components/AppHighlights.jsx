import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ title, description, icon, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 cursor-pointer"
    >
        <div className="w-14 h-14 bg-premium-light rounded-xl flex items-center justify-center mb-6 text-premium-accent text-2xl">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-premium-dark mb-3">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
);

const AppHighlights = () => {
    const features = [
        {
            title: "Secure Login",
            description: "Biometric authentication and multi-factor security ensure your account and data are always protected.",
            icon: "🔒"
        },
        {
            title: "Digital Declarations",
            description: "Sign and submit important declarations digitally, saving time and reducing paperwork.",
            icon: "✍️"
        },
        {
            title: "Streamlined Process",
            description: "Intuitive workflows designed to make complex investment tasks simple and fast.",
            icon: "⚡"
        },
        {
            title: "Real-time Updates",
            description: "Stay informed with instant notifications about your investment status and requests.",
            icon: "🔔"
        }
    ];

    return (
        <section id="features" className="py-20 bg-premium-light">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-bold text-premium-dark mb-4"
                    >
                        Why Choose Eminates?
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-600 max-w-2xl mx-auto"
                    >
                        Built with the latest technology to ensure security, speed, and reliability for all your investment needs.
                    </motion.p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AppHighlights;
