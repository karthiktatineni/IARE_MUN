import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="logo-container">
              <div className="mun-logo">
                <div className="globe-icon">
                  
                </div>
                <h1>MODEL UNITED NATIONS 2026</h1>
              </div>
            </div>
            <p className="hero-subtitle">Institute of Aeronautical Engineering</p>
            <p className="hero-description">
              Join us for an immersive 3-day Model United Nations conference where students
              engage in diplomatic debates, negotiate resolutions, and experience international
              relations firsthand.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">Register Now</Link>
              <Link to="/about" className="btn btn-secondary">Learn More</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features section">
        <div className="container">
          <h2 className="section-title">Why Attend IARE MUN?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Perspective</h3>
              <p>Engage with pressing international issues and develop a deeper understanding of global affairs.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🗣️</div>
              <h3>Public Speaking</h3>
              <p>Enhance your communication and public speaking skills in a professional environment.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Networking</h3>
              <p>Connect with like-minded students from various institutions and build lasting relationships.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Research Skills</h3>
              <p>Develop critical thinking and research abilities through in-depth policy analysis.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
