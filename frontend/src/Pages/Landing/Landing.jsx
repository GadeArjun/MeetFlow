import React, { useState, useEffect, useContext } from "react";
import {
  Menu,
  X,
  Video,
  Monitor,
  Disc,
  Shield,
  Smartphone,
  Calendar,
  Check,
  Twitter,
  Linkedin,
  Github,
  Award,
  Zap,
} from "lucide-react";
import "./Landing.css";
import logo from "../../assets/images/logo.png";
import heroBanner from "../../assets/images/heroBanner.png";
import teamCollaboration from "../../assets/images/teamCollaboration.png";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import Meta from "../../Components/Meta/Meta";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, userContextLoading } = useContext(UserContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`}>
      <div className="container header-content">
        <a href="#">
          <img
            src={logo}
            alt="MeetFlow Logo"
            className="logo-image-landing-top"
            width={"160px"}
          />
        </a>
        <nav className={`nav-menu ${isMenuOpen ? "open" : ""}`}>
          <a href="#home" onClick={() => setIsMenuOpen(false)}>
            Home
          </a>
          <a href="#features" onClick={() => setIsMenuOpen(false)}>
            Features
          </a>
          <a href="#about" onClick={() => setIsMenuOpen(false)}>
            About
          </a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>
            Contact
          </a>
          {userContextLoading ? (
            <Link to="/" className="login-button">
              Loding...
            </Link>
          ) : user ? (
            <Link to="/dashboard" className="login-button">
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="login-button">
              Log in
            </Link>
          )}
        </nav>

        <button
          className="hamburger-menu"
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

const Hero = () => (
  <section id="home" className="hero-section fade-in">
    <div className="container hero-container">
      <div className="hero-text-content">
        <h1>
          Seamless Meetings. <br />
          Anytime. Anywhere.
        </h1>
        <p className="subheading">
          Connect, collaborate, and create with MeetFlow's high-quality video
          conferencing.
        </p>
        <div className="hero-buttons">
          <Link to="/login" className="button primary-button">
            Start a free meeting
          </Link>
          <a href="#features" className="button secondary-button">
            Explore Features
          </a>
        </div>
      </div>
      <div className="hero-image-container">
        <img
          src={heroBanner}
          alt="MeetFlow Meeting Screenshot"
          className="hero-image"
        />
      </div>
    </div>
  </section>
);

const features = [
  {
    icon: <Video />,
    title: "High-Quality Video Calls",
    description:
      "Experience crystal-clear video and audio for flawless communication.",
  },
  {
    icon: <Monitor />,
    title: "Screen Sharing",
    description:
      "Easily share your screen to present documents, slides, and more.",
  },
  {
    icon: <Disc />,
    title: "Meeting Recording",
    description:
      "Record your meetings and save them for future reference and sharing.",
  },
  {
    icon: <Shield />,
    title: "Secure Access",
    description:
      "Your meetings are protected with end-to-end encryption and secure access.",
  },
  {
    icon: <Smartphone />,
    title: "Cross-Platform Support",
    description:
      "Join meetings from any device, including desktops, tablets, and smartphones.",
  },
  {
    icon: <Calendar />,
    title: "Calendar Integration",
    description:
      "Sync with your calendar to schedule and join meetings with a single click.",
  },
];

const Features = () => (
  <section id="features" className="features-section">
    <div className="container">
      <h2 className="section-title">Key Features</h2>
      <p className="section-subtitle">
        Everything you need to run your meetings smoothly and efficiently.
      </p>
      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const About = () => (
  <section id="about" className="about-section">
    <div className="container about-container">
      <div className="about-image-container">
        <img
          src={teamCollaboration}
          alt="Team collaboration"
          className="about-image"
        />
      </div>
      <div className="about-content">
        <h2 className="section-title">Why Choose MeetFlow?</h2>
        <ul className="about-list">
          <li>
            <Check size={20} className="check-icon" />
            <p>
              <span className="list-title">Intuitive Interface:</span> Our
              platform is designed for simplicity, making it easy for anyone to
              start a meeting in seconds.
            </p>
          </li>
          <li>
            <Check size={20} className="check-icon" />
            <p>
              <span className="list-title">Reliable Performance:</span> Built on
              a robust infrastructure for a lag-free and consistent experience.
            </p>
          </li>
          <li>
            <Check size={20} className="check-icon" />
            <p>
              <span className="list-title">Flexible Solutions:</span> From small
              teams to large enterprises, MeetFlow scales to meet your needs.
            </p>
          </li>
          <li>
            <Check size={20} className="check-icon" />
            <p>
              <span className="list-title">Dedicated Support:</span> Our team is
              here to help you every step of the way with a dedicated support
              system.
            </p>
          </li>
        </ul>
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="cta-section">
    <div className="container cta-content">
      <h2>Ready to elevate your team's communication?</h2>
      <Link to="/login" className="button cta-button">
        Start your first meeting <Zap size={20} />
      </Link>
    </div>
  </section>
);

const Footer = () => (
  <footer id="contact" className="footer">
    <div className="container footer-content">
      <div className="footer-logo-tagline">
        <img
          src={logo}
          alt="MeetFlow Logo"
          className="logo-image-landing-footer"
          width={"200px"}
        />
        <p className="tagline">Connecting teams, one meeting at a time.</p>
      </div>
      <div className="footer-nav">
        <h4>Product</h4>
        <nav>
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </nav>
      </div>
      <div className="footer-nav">
        <h4>Company</h4>
        <nav>
          <a href="#contact">Contact</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </nav>
      </div>
      <div className="footer-social">
        <h4>Follow Us</h4>
        <div className="social-icons">
          <a href="#" aria-label="Twitter">
            <Twitter size={24} />
          </a>
          <a href="#" aria-label="LinkedIn">
            <Linkedin size={24} />
          </a>
          <a href="#" aria-label="GitHub">
            <Github size={24} />
          </a>
        </div>
      </div>
    </div>
    <div className="copyright">© 2024 MeetFlow. All rights reserved.</div>
  </footer>
);

const Landing = () => {
  useEffect(() => {
    // Intersection Observer for fade-in effect on scroll
    const sections = document.querySelectorAll(
      ".features-section, .about-section"
    );
    const observerOptions = {
      root: null,
      threshold: 0.1,
      rootMargin: "0px",
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <>
      <Meta page={"home"} />
      <Header />
      <main>
        <Hero />
        <Features />
        <About />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default Landing;
