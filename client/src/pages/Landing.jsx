import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import About from '../components/About';
import DashboardSection from '../components/DashboardSection';
import ResourcesSection from '../components/ResourcesSection';
import PricingSection from '../components/PricingSection';
import ContactSection from '../components/ContactSection';
import Chatbot from '../components/Chatbot';
import ProductTourModal from '../components/ProductTourModal';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <About />
      <DashboardSection />
      <ResourcesSection />
      <PricingSection />
      <ContactSection />
      <Chatbot />
      <ProductTourModal />
      <Footer />
    </main>
  );
};

export default Landing;
