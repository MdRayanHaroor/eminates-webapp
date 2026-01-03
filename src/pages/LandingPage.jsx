import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import AppHighlights from '../components/AppHighlights';
import Download from '../components/Download';
import Footer from '../components/Footer';
import ParticleBackground from '../components/ParticleBackground';
import UnifiedBusinessShowcase from '../components/UnifiedBusinessShowcase';

function LandingPage() {
    return (
        <div className="min-h-screen font-sans text-premium-dark overflow-x-hidden relative">

            {/* 3D Background Layer */}
            <ParticleBackground />

            {/* Content Layer */}
            <div className="relative z-10">
                <Navbar />
                <Hero />
                <About />
                <AppHighlights />
                <UnifiedBusinessShowcase />
                <Download />
                <Footer />
            </div>
        </div>
    );
}

export default LandingPage;
