import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">IARE Model United Nations</h1>
            <p className="hero-tagline">Where Diplomacy Meets Leadership</p>
            <p className="hero-dates"></p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Register Now</Link>
              <Link to="/committees" className="btn btn-secondary">View Committees</Link>
            </div>

            {/*<a href="#features" className="scroll-down" aria-label="Scroll down to features section">
              <div className="mouse">
                <div className="wheel"></div>
              </div>
              <div className="arrows">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </a>*/}
          </div>
        </div>
      </section>

      <section id="features" className="features section">
        <div className="container">
          <h2 className="section-title">Why Join IARE MUN 2026?</h2>
          <div className="features-grid">
            <div className="feature-card" style={{ backgroundImage: "url('https://meritoriouscollege.com/wp-content/uploads/2021/02/10.jpg')" }}>
              <div className="feature-overlay">
                <h3>Shape Tomorrow's Leaders</h3>
                <p>Step into the shoes of world leaders and diplomats. Experience the thrill of negotiating international treaties and making decisions that could change the world.</p>
              </div>
            </div>
            <div className="feature-card" style={{ backgroundImage: "url('https://m.media-amazon.com/images/I/618TdG5ZsbL._AC_UF1000,1000_QL80_.jpg')" }}>
              <div className="feature-overlay">
                <h3>Master the Art of Persuasion</h3>
                <p>Transform your ideas into powerful arguments. Learn to influence, negotiate, and build consensus like seasoned diplomats in high-stakes debates.</p>
              </div>
            </div>
            <div className="feature-card" style={{ backgroundImage: "url('https://www.rootinc.com/wp-content/uploads/2024/04/Unlocking-Your-Potential-2.png')" }}>
              <div className="feature-overlay">
                <h3>Unlock Your Potential</h3>
                <p>Discover hidden talents in leadership, critical thinking, and strategic planning. Walk away with skills that will set you apart in any career path.</p>
              </div>
            </div>
            <div className="feature-card" style={{ backgroundImage: "url('https://www.careersinpoland.com/media/file/articles/thumbs/950x540_international-career-day-launch-your-career-poland-collegium-civitas.jpg')" }}>
              <div className="feature-overlay">
                <h3>Launch Your Career</h3>
                <p>Build an impressive portfolio with certificates, awards, and connections. Many MUN alumni go on to prestigious careers in diplomacy, law, and international business.</p>
              </div>
            </div>
            <div className="feature-card" style={{ backgroundImage: "url('https://static0.colliderimages.com/wordpress/wp-content/uploads/2022/08/emergency-declaration-featured.jpg?w=1200&h=675&fit=crop')" }}>
              <div className="feature-overlay">
                <h3>Experience Real Drama</h3>
                <p>Feel the adrenaline of crisis committees, emergency sessions, and breaking news scenarios. Every moment is unpredictable and exciting.</p>
              </div>
            </div>
            <div className="feature-card" style={{ backgroundImage: "url('https://images.squarespace-cdn.com/content/v1/5c8d6ced7eb88c05a818ecc2/1659925182531-W1YUKMNW77ANXXPP4S9A/modelun.jpeg?format=1500w')" }}>
              <div className="feature-overlay">
                <h3>Join an Elite Community</h3>
                <p>Become part of an exclusive network of future leaders, innovators, and changemakers from top institutions across the region.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
