import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HamburgerMenu from '../components/HamburgerMenu';
import Footer from '../components/Footer';
import { FaLinkedin, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import { FaChartLine, FaBullhorn, FaCogs } from 'react-icons/fa';
import '../styles/B8Marketting.css';

export default function B8Marketing() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const pricingPlans = [
    {
      icon: <FaChartLine size={40} />,
      title: 'Basic Marketing Package',
      price: '$500/month',
      description: 'Perfect for startups looking to establish their online presence.',
    },
    {
      icon: <FaBullhorn size={40} />,
      title: 'Advanced Marketing Strategy',
      price: '$1500/month',
      description: 'Ideal for growing businesses wanting aggressive growth strategies.',
    },
    {
      icon: <FaCogs size={40} />,
      title: 'Custom Campaigns',
      price: 'Contact us for pricing',
      description: 'Tailored solutions for unique marketing needs.',
    },
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      {/* Header Video Placeholder */}
      <section className="header-video">
        <div className="video-placeholder">
          <p>Header Video Placeholder</p>
        </div>
      </section>

      {/* Intro About Section */}
      <section className="intro-about">
        <h2>About B8 Marketing</h2>
        <p>
          At B8 Marketing, we specialize in innovative marketing strategies designed to elevate brands to new heights. 
          Our team is dedicated to delivering impactful campaigns that resonate with audiences globally.
        </p>
      </section>

      {/* Existing Hero Section */}
      <section className="hero">
        <h1>B8 Marketing</h1>
        <p>Innovative marketing strategies to boost your brand's presence globally.</p>
      </section>

      {/* Gallery of Media with Descriptions */}
      <section className="gallery">
        <div className="gallery-item">
          <img src="/assets/marketing1.jpg" alt="Marketing Campaign 1" />
          <p>Campaign 1: Social Media Engagement Strategy</p>
        </div>
        <div className="gallery-item">
          <img src="/assets/marketing2.jpg" alt="Marketing Campaign 2" />
          <p>Campaign 2: Influencer Partnerships for Brand Growth</p>
        </div>
        <div className="gallery-item">
          <img src="/assets/marketing3.jpg" alt="Marketing Campaign 3" />
          <p>Campaign 3: Viral Video Production and Promotion</p>
        </div>
      </section>

      {/* Companies We've Worked With */}
      <section className="companies-worked-with">
        <h3>Companies We've Worked With</h3>
        <div className="company-logos">
          <img src="/assets/company1-logo.png" alt="Company 1" />
          <img src="/assets/company2-logo.png" alt="Company 2" />
          <img src="/assets/company3-logo.png" alt="Company 3" />
        </div>
      </section>

      {/* Links to Social Channels */}
      <section className="social-channels">
        <h3>Follow Us</h3>
        <div className="social-media">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
        </div>
      </section>

      {/* Detailed Contact Us Form */}
      <section className="contact-section">
        <h3>Contact Us</h3>
        <form className="contact-form">
          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <input type="text" placeholder="What Do You Want?" required />
          <input type="tel" placeholder="Phone Number" required />
          <textarea placeholder="Your Query" required></textarea>
          <button type="submit">Send Message</button>
        </form>
      </section>

      {/* Pricing List */}
      <section className="pricing-list">
        <h3>Our Pricing</h3>
        <div className="pricing-cards">
          {pricingPlans.map((plan, index) => (
            <div className="pricing-card" key={index}>
              <div className="icon-container">{plan.icon}</div>
              <h4>{plan.title}</h4>
              <p className="price">{plan.price}</p>
              <p className="description">{plan.description}</p>
            </div>
          ))}
        </div>
    </section>

      {/* Email Submission Form */}
      <section className="email-submission-form">
        <h3>Subscribe to Our Newsletter</h3>
        <form>
          <input type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </section>

      <Footer />
    </div>
  );
}
