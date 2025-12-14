import React from 'react';
import { motion } from 'framer-motion';
import { FcAndroidOs } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io";
import { useEffect, useState } from "react";
import { getLatestApkUrl } from "../lib/getLatestApk";

const Download = () => {

    const [apkUrl, setApkUrl] = useState(null);

    useEffect(() => {
        getLatestApkUrl().then(setApkUrl);
    }, []);

    return (
        <section id="download" className="py-24 bg-premium-dark text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-24 -left-24 w-96 h-96 bg-premium-accent rounded-full blur-3xl"
                ></motion.div>
                <motion.div
                    animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"
                ></motion.div>
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-5xl font-bold mb-6"
                >
                    Ready to Get Started?
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
                >
                    Download the Eminates Investor App today and take control of your financial future. Available now for Android.
                </motion.p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                    <motion.a
                        href={apkUrl ?? "#"}
                        download
                        onClick={(e) => {
                            if (!apkUrl) {
                                console.warn("APK URL not loaded yet");
                                e.preventDefault(); // stop .htm download
                            }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer"
                    >
                        <FcAndroidOs className="text-4xl" />
                        <div className="text-left">
                            <div className="text-xs font-normal opacity-80">Download APK</div>
                            <div className="leading-none">Android Version</div>
                        </div>
                    </motion.a>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-800 text-gray-400 px-6 py-4 rounded-xl font-bold text-lg border border-gray-700 cursor-not-allowed flex items-center gap-3 w-full sm:w-auto justify-center"
                    >
                        <IoLogoApple className="text-4xl" />
                        <div className="text-left">
                            <div className="text-xs font-normal opacity-80">Coming Soon</div>
                            <div className="leading-none">iOS Version</div>
                        </div>
                    </motion.button>
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="mt-8 text-sm text-gray-500"
                >
                    * Requires Android 8.0 or higher. By downloading, you agree to our Terms of Service.
                </motion.p>
            </div>
        </section>
    );
};

export default Download;
