// src/HomePage.tsx
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HamburgerMenu from '../components/HamburgerMenu';
import Footer from '../components/Footer';
import { FaLinkedin, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { FaBullhorn, FaCar, FaTshirt, FaGraduationCap, FaUsers, FaGlobe, FaHeart, FaBriefcase } from 'react-icons/fa';
import '../styles/HomePage.css';
import ContactForm from '../components/ContactForm';

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const services = [
    { icon: <FaBullhorn size={40} />, title: 'B8 Marketing', description: 'Innovative marketing strategies.', link: '/b8-marketing', color: '#FFF', hoverColor: 'rgba(255, 255, 255, 0.5)', iconColor: '#FFF', iconHoverColor: '#000', restricted: false },
    { icon: <FaUsers size={40} />, title: 'Bgr8', description: 'Community growth programs.', link: '/bgr8', color: '#FFF', hoverColor: 'rgba(255, 215, 0, 0.5)', iconColor: '#FFF', iconHoverColor: '#000', restricted: true },
    { icon: <FaCar size={40} />, title: 'B8 Car Club', description: 'Exclusive car events.', link: '/b8-car-club', color: '#FFF', hoverColor: 'rgba(255, 0, 0, 0.5)', iconColor: '#FFF', iconHoverColor: '#000', restricted: true },
    { icon: <FaTshirt size={40} />, title: 'B8 Clothing', description: 'Stylish modern apparel.', link: '/b8-clothing', color: '#FFF', hoverColor: 'rgba(139, 69, 19, 0.5)', iconColor: '#FFF', iconHoverColor: '#000', restricted: true },
    { icon: <FaGlobe size={40} />, title: 'B8 League', description: 'Passion for sports.', link: '/b8-league', color: '#FFF', hoverColor: 'rgba(128, 0, 128, 0.5)', iconColor: '#FFF', iconHoverColor: '#000', restricted: true },
    { icon: <FaHeart size={40} />, title: 'B8 World', description: 'Making the world a B8er place', link: '/b8-charity', color: '#FFF', hoverColor: 'rgba(0, 0, 255, 0.5)', iconColor: '#FFF', iconHoverColor: '#000', restricted: true },
    { icon: <FaGraduationCap size={40} />, title: 'Bgr8r', description: 'Empowering future generations.', link: '/b8-education', color: '#FFF', hoverColor: 'rgba(0, 128, 0, 0.5)', iconColor: '#FFF', iconHoverColor: '#000', restricted: true },
    { icon: <FaBriefcase size={40} />, title: 'B8 Careers', description: 'Grow and innovate with us.', link: '/b8-careers', color: '#FFF', hoverColor: 'rgba(0, 0, 0, 0.5)', iconColor: '#FFF', iconHoverColor: '#FFF', restricted: true },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="homepage">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      {/* Intro Video Section */}
      <section className="intro-video">
        <div className="video-placeholder">
          <p>Intro Video Placeholder</p>
        </div>
      </section>

      <section className="hero">
        <h2>Empowering Your Business</h2>
        <p>
          We provide cutting-edge marketing strategies and innovative software development solutions tailored to your business needs.
        </p>
        <button>
          <Link to="/b8-marketing" style={{ color: 'white', textDecoration: 'none' }}>Explore B8 Marketing</Link>
        </button>
      </section>

      <section className="services">
        <h3>Explore B8</h3>
        <div className="service-list">
          {services.map((service, index) => (
            <Link 
              to={service.link} 
              className={`service-card ${service.restricted ? 'restricted' : ''}`}
              key={index}
              style={{ 
                '--hover-color': service.hoverColor,
                '--icon-color': service.iconColor,
                '--icon-hover-color': service.iconHoverColor,
                color: service.color 
              } as React.CSSProperties}
            >
              <div className="icon-container" style={{ color: service.iconColor }}>{service.icon}</div>
              <h4>{service.title}</h4>
              <p>{service.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="contact-section">
        <ContactForm source="home" />
        <div className="social-media">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://www.instagram.com/b8carclub/" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://www.youtube.com/@B8Cars" target="_blank" rel="noopener noreferrer">
            <FaYoutube />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
