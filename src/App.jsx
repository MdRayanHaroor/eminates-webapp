import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import AppHighlights from './components/AppHighlights';
import Download from './components/Download';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-premium-light font-sans text-premium-dark overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <AppHighlights />
      <Download />
      <Footer />
    </div>
  );
}

export default App;
