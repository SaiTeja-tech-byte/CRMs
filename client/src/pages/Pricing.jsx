import React from "react";
import Navbar from "../components/Navbar";
import PricingSection from "../components/PricingSection";
import Footer from "../components/Footer";

const Pricing = () => {
  return (
    <div className="pricing-page">
      <Navbar />
      {/* Spacer to push content below sticky header */}
      <div style={{ height: "80px" }}></div>
      <main>
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
