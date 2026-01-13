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
import ScrollToTop from './components/ScrollToTop';
import ParticlesBackground from './components/ParticlesBackground';
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ParticlesBackground />

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
