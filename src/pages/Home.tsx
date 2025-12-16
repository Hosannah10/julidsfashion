import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import About from "../components/About";
import Services from "../components/Services";
import Contact from "../components/Contact";
import { Helmet } from "react-helmet-async";
import "./styles/Home.css";

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>JuliD’s Fashion World | Luxury Ready-Made & Bespoke Wears</title>
        <meta
          name="description"
          content="Discover luxury ready-made and bespoke fashion from JuliD’s Fashion World. Corporate, casual, streetwear, kiddies, and bridal designs."
        />
        <link rel="canonical" href="https://julidsfashion.com/" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FashionStore",
            "name": "JuliD’s Fashion World",
            "image": "https://julidsfashion.com/JulidsFashionlogo.jpg",
            "url": "https://julidsfashion.com",
            "telephone": "+2348062794492",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Ketu",
              "addressRegion": "Lagos",
              "addressCountry": "NG"
            },
            "sameAs": [
              "https://www.instagram.com/julidsfashion",
              "https://www.facebook.com/share/15aCpPc2PR/"
            ]
          })}
        </script>
      </Helmet>
      <Navbar />
      <HeroSection />
      <About />
      <Services />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;
