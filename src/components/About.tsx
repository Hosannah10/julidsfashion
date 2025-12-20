import React from "react";
import "./styles/About.css";
import AboutImg from "../assets/AboutJulidFashion.png"; 

const About: React.FC = () => (
  <section id="aboutcontainer" className="about container">
    <div className="about-content">
      <div className="about-image">
        <img src={AboutImg} alt="Juliet Bello at JuliD’s Fashion World" loading="lazy" />
      </div>
      <div className="about-text">
        <h2>About JuliD’s Fashion World</h2>
        <p>
          Founded by <strong>Juliet Bello</strong>, JuliD’s Fashion World is a Lagos-based fashion studio dedicated to crafting stylish, elegant, and timeless outfits. From ready-made corporate and casual wears to bespoke bridal and asoebi designs, our passion lies in bringing your fashion dreams to life.
        </p>
        <p>
          Every piece we create embodies precise tailoring, comfort, and confidence — ensuring you don’t just wear fashion, but express personality and poise with every outfit.
        </p>
      </div>
    </div>
  </section>
);

export default About;
