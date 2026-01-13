import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Committees from './pages/Committees';
import Schedule from './pages/Schedule';
import Registration from './pages/Registration';
import CountryMatrix from './pages/CountryMatrix';
import Secretariat from './pages/Secretariat';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <Router>
      {/* Video Background */}
      <video
        className="video-background"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={(e) => console.error('Video error:', e)}
        onLoadStart={() => console.log('Video loading started')}
        onCanPlay={() => console.log('Video can play')}
      >
        <source src="/bg2.mp4" type="video/mp4" />
        
      </video>
      <div className="video-overlay"></div>

      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/committees" element={<Committees />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/country-matrix" element={<CountryMatrix />} />
        <Route path="/secretariat" element={<Secretariat />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
