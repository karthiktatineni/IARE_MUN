import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <p className="hero-eyebrow">Institute of Aeronautical Engineering</p>
            <h1 className="hero-title">
              IARE MUN-
              <span className="hero-year-highlight">  2026</span>
            </h1>
            <p className="hero-description">
              Join us for an immersive 3-day Model United Nations conference<br />
              Where Diplomacy Meets Leadership
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
