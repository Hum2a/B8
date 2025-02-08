import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import HamburgerMenu from '../components/HamburgerMenu';
import Footer from '../components/Footer';
import '../styles/Pages.css';

export default function B8Careers() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="page">
      {isMobile ? <HamburgerMenu /> : <Navbar />}

      <section className="hero">
        <h1>B8 Careers</h1>
        <p>Join our team and be part of a dynamic organization focused on growth and innovation.</p>
      </section>

      <section className="gallery">
        <img src="/assets/car-club1.jpg" alt="Car Event 1" />
        <img src="/assets/car-club2.jpg" alt="Car Event 2" />
        <img src="/assets/car-club3.jpg" alt="Car Event 3" />
      </section>

      <Footer />
    </div>
  );
}
