import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/Navbar.css";
import logo from "../assets/JulidsFashionlogo.jpg";
import { FaUserCircle } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }

    const section = document.getElementById(id);
    if (section) {
      const yOffset = -90;
      const yPosition = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: yPosition, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = ["home", "aboutcontainer", "services", "contactcontainer"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") setActiveSection("");
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={() => setIsOpen(false)}>
          <img src={logo} alt="Julid's Fashion Logo" />
        </Link>

        {/* Hamburger Menu */}
        <div className="menu-icon" onClick={toggleMenu}>
          <span className={isOpen ? "bar open" : "bar"}></span>
          <span className={isOpen ? "bar open" : "bar"}></span>
          <span className={isOpen ? "bar open" : "bar"}></span>
        </div>

        {/* Navigation Links */}
        <ul className={isOpen ? "nav-links active" : "nav-links"}>
          <li>
            <a
              href="#home"
              className={`nav-item ${activeSection === "home" ? "active" : ""}`}
              onClick={(e) => handleScroll(e, "home")}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className={`nav-item ${activeSection === "aboutcontainer" ? "active" : ""}`}
              onClick={(e) => handleScroll(e, "aboutcontainer")}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#services"
              className={`nav-item ${activeSection === "services" ? "active" : ""}`}
              onClick={(e) => handleScroll(e, "services")}
            >
              Services
            </a>
          </li>
          <li>
            <a
              href="#contact"
              className={`nav-item ${activeSection === "contactcontainer" ? "active" : ""}`}
              onClick={(e) => handleScroll(e, "contactcontainer")}
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Auth / Profile Section */}
        <div className="nav-buttons">
          
          {user ? (
            <div className="profile-wrapper">
              <div className="profile-static">
                <FaUserCircle size={30} className="profile-icon static" />
                <span className="profile-name static">{user.name || "User"}</span>
              </div>
              <button
                className="btn logout"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/register"
                className="btn create-account"
                onClick={() => {
                  setIsOpen(false);
                  setActiveSection("");
                }}
              >
                Create Account
              </Link>
              <Link
                to="/login"
                className="btn login"
                onClick={() => {
                  setIsOpen(false);
                  setActiveSection("");
                }}
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;





