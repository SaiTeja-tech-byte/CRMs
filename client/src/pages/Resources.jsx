import React from "react";
import Navbar from "../components/Navbar";
import ResourcesSection from "../components/ResourcesSection";
import Footer from "../components/Footer";

const Resources = () => {
  return (
    <div className="resources-page">
      <Navbar />
      <div style={{ height: "80px" }}></div>
      <main>
        <ResourcesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
