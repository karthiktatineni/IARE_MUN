import { useNavigate } from 'react-router-dom';
import './Registration.css';

function Registration() {
  const navigate = useNavigate();

  // Function to open Google Forms
  const openGoogleForm = (formType) => {
    // Replace these URLs with your actual Google Form URLs
    const formUrls = {
      internal: 'https://forms.gle/EEGEXhE3sNuVUyrM6', // Replace with actual internal form URL
      external: 'https://forms.gle/tvRh5G9MZZGaWdF38'  // Replace with actual external form URL
    };
    
    window.open(formUrls[formType], '_blank');
  };

  return (
    <div className="registration">
      <section className="page-header">
        <div className="container">
          <h1>Delegate Registration</h1>
          <p>Register for IARE MUN 2024</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="registration-options">
            <div className="registration-intro">
              <h2>Choose Your Registration Type</h2>
              <p>Please select the appropriate registration form based on your affiliation</p>
            </div>

            <div className="country-matrix-navigation">
              <p className="matrix-info">
                Want to check which countries/positions are available before registering?
              </p>
              <button
                type="button"
                className="btn-country-matrix"
                onClick={() => navigate('/country-matrix')}
              >
                View Country Matrix
              </button>
            </div>

            <div className="registration-buttons">
              <div className="registration-card internal">
                <div className="card-header">
                  <h3>Internal Delegates</h3>
                  <p>For students from IARE College</p>
                </div>
                <div className="card-content">
                  <ul>
                    <li>Current IARE students</li>
                    <li>Special registration rates</li>
                    <li>Direct college coordination</li>
                    <li>Campus-based support</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <button
                    className="btn-register internal-btn"
                    onClick={() => openGoogleForm('internal')}
                  >
                    Register as Internal Delegate
                  </button>
                </div>
              </div>

              <div className="registration-card external">
                <div className="card-header">
                  <h3>External Delegates</h3>
                  <p>For students from other institutions</p>
                </div>
                <div className="card-content">
                  <ul>
                    <li>Students from other colleges/schools</li>
                    <li>Individual participants</li>
                    <li>Professional delegates</li>
                    <li>General registration process</li>
                  </ul>
                </div>
                <div className="card-footer">
                  <button
                    className="btn-register external-btn"
                    onClick={() => openGoogleForm('external')}
                  >
                    Register as External Delegate
                  </button>
                </div>
              </div>
            </div>

            <div className="registration-info">
              <div className="info-section">
                <h3>Registration Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <h4>Committees Available</h4>
                    <ul>
                      <li>UNSC - United Nations Security Council</li>
                      <li>DISEC - Disarmament and International Security Committee</li>
                      <li>AIPPM - All India Political Parties Meet</li>
                      <li>IP - Israel-Palestine Committee</li>
                    </ul>
                  </div>
                  <div className="info-item">
                    <h4>What to Expect</h4>
                    <ul>
                      <li>Committee preference selection</li>
                      <li>Country/position allocation</li>
                      <li>Registration confirmation</li>
                      <li>Event details and guidelines</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Registration;