import React from 'react';
import { motion } from 'framer-motion';
import TiltCard from './TiltCard'; // Import the new component

const FeatureCard = ({ title, description, icon, index }) => (
    <div className="h-full perspective-1000"> {/* Added perspective container */}
        <TiltCard className="h-full bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20 cursor-pointer relative overflow-hidden group">
            {/* Glossy shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="w-14 h-14 bg-premium-light rounded-xl flex items-center justify-center mb-6 text-premium-accent text-2xl shadow-inner">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-premium-dark mb-3">{title}</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
        </TiltCard>
    </div>
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
        <section id="features" className="py-20 relative z-20"> {/* Removed bg-premium-light to show particles */}
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