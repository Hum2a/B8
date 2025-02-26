import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import HamburgerMenu from '../../components/HamburgerMenu';
import Footer from '../../components/Footer';
import { FaLinkedin, FaInstagram, FaYoutube, FaTwitter, FaGlobe, FaHashtag } from 'react-icons/fa';
import { FaChartLine, FaBullhorn, FaCogs, FaWordpress, FaGoogle, FaCamera, FaCode, FaSearchengin, FaCalendarAlt, FaStream, FaVideo, FaPalette, FaHubspot } from 'react-icons/fa';
import '../../styles/businessStyles/B8Marketing.css';

// Import company logos
import company1 from '../../assets/Marketing/Hyundai.png';
import company2 from '../../assets/Marketing/Surrey.png';
import company3 from '../../assets/Marketing/Volkwagen.png';

// Define categories and software
const categories = [
  "All",
  "CMS",
  "SEO & Analytics",
  "Plugins",
  "Digital Media",
  "Developer Tools"
];

const marketingSoftware = [
  // CMS
  {
    icon: <FaCamera size={40} />,
    name: "Adobe Experience Manager",
    description: "Enterprise-level content management system for building websites, mobile apps and forms",
    category: "CMS"
  },
  {
    icon: <FaWordpress size={40} />,
    name: "WordPress",
    description: "World's most popular CMS platform for website creation and content management",
    category: "CMS"
  },
  {
    icon: <FaHubspot size={40} />,
    name: "HubSpot",
    description: "All-in-one inbound marketing, sales, and CRM platform",
    category: "CMS"
  },

  // SEO and Analytics
  {
    icon: <FaGoogle size={40} />,
    name: "Google Analytics (GA4)",
    description: "Advanced analytics platform for measuring website and app performance",
    category: "SEO & Analytics"
  },
  {
    icon: <FaSearchengin size={40} />,
    name: "Google Search Console",
    description: "Tool for monitoring and optimizing website's presence in Google Search results",
    category: "SEO & Analytics"
  },
  {
    icon: <FaChartLine size={40} />,
    name: "Microsoft Clarity",
    description: "Behavioral analytics tool for understanding how users interact with your website",
    category: "SEO & Analytics"
  },

  // Plugins
  {
    icon: <FaStream size={40} />,
    name: "Storystream",
    description: "Visual content marketing platform for creating and managing social media content",
    category: "Plugins"
  },
  {
    icon: <FaChartLine size={40} />,
    name: "ContentSquare",
    description: "Digital experience analytics platform for understanding user behavior",
    category: "Plugins"
  },
  {
    icon: <FaStream size={40} />,
    name: "Hootsuite",
    description: "Social media management and scheduling platform",
    category: "Plugins"
  },
  {
    icon: <FaCalendarAlt size={40} />,
    name: "Calendly",
    description: "Automated scheduling software for streamlining meeting coordination",
    category: "Plugins"
  },

  // Digital Media
  {
    icon: <FaCamera size={40} />,
    name: "Adobe Suite",
    description: "Professional creative tools including Photoshop and Premiere Pro",
    category: "Digital Media"
  },
  {
    icon: <FaVideo size={40} />,
    name: "DaVinci Resolve",
    description: "Professional video editing, color correction, and post-production software",
    category: "Digital Media"
  },
  {
    icon: <FaVideo size={40} />,
    name: "CapCut",
    description: "User-friendly video editing software for quick content creation",
    category: "Digital Media"
  },
  {
    icon: <FaPalette size={40} />,
    name: "Canva",
    description: "Online design platform for creating visual content",
    category: "Digital Media"
  },

  // Developer Tools
  {
    icon: <FaCode size={40} />,
    name: "Developer Tools",
    description: "Suite of professional development tools and frameworks",
    category: "Developer Tools"
  }
];

export default function B8Marketing() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredSoftware = marketingSoftware.filter(software => 
    selectedCategory === "All" || software.category === selectedCategory
  );

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

  const marketingServices = [
    {
      category: 'Web Marketing',
      icon: <FaGlobe size={40} />,
      title: 'Digital Web Marketing',
      services: [
        'Search Engine Optimization (SEO)',
        'Content Marketing Strategy',
        'Email Marketing Campaigns',
        'Google Ads Management',
        'Website Analytics & Optimization',
        'Landing Page Optimization'
      ],
      price: 'Starting from $1000/month'
    },
    {
      category: 'Social Media',
      icon: <FaHashtag size={40} />,
      title: 'Social Media Marketing',
      services: [
        'Social Media Management',
        'Influencer Partnerships',
        'Content Creation & Scheduling',
        'Community Engagement',
        'Paid Social Advertising',
        'Social Media Analytics'
      ],
      price: 'Starting from $800/month'
    }
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      {/* Updated Header Video Section */}
      <section className="header-video">
        <div className="video-container">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/uPXf6RjA5RI"
            title="B8 Marketing Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
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
          <div className="logo-wrapper">
            <img src={company1} alt="Company 1" />
          </div>
          <div className="logo-wrapper">
            <img src={company2} alt="Company 2" />
          </div>
          <div className="logo-wrapper">
            <img src={company3} alt="Company 3" />
          </div>
        </div>
      </section>

      {/* Add this new section before the pricing section */}
      <section className="marketing-services">
        <h2>Our Marketing Solutions</h2>
        <div className="services-container">
          {marketingServices.map((service, index) => (
            <div className="marketing-service-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.category}</h3>
              <h4>{service.title}</h4>
              <ul className="service-list">
                {service.services.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className="service-price">{service.price}</p>
              <button className="learn-more-btn">Learn More</button>
            </div>
          ))}
        </div>
      </section>

      {/* Software Tools Section */}
      <section className="software-tools">
        <h2>Our Marketing Tech Stack</h2>
        <p>We use industry-leading software to deliver exceptional results</p>
        
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="software-grid">
          {filteredSoftware.map((software, index) => (
            <div className="software-card" key={index}>
              <div className="software-icon">{software.icon}</div>
              <h4>{software.name}</h4>
              <p className="software-category">{software.category}</p>
              <p className="software-description">{software.description}</p>
            </div>
          ))}
        </div>
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
