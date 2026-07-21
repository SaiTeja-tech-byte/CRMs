import React from "react";
import Navbar from "../components/Navbar";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <div className="contact-page">
      <Navbar />
      <div style={{ height: "80px" }}></div>
      <main>
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
