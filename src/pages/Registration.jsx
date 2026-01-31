import './Registration.css';

function Registration() {
  return (
    <div className="registration">
      <section className="page-header">
        <div className="container">
          <h1>Delegate Registration</h1>
          <p>Register for IARE MUN 2026</p>
        </div>
      </section>

      <section className="section registration-soon-section">
        <div className="container">
          <div className="registration-soon-content">
            <div className="soon-card">

              <h2>Registrations Opening Soon</h2>
              <p className="soon-text">
                Prepare yourself for the ultimate diplomatic experience.
                Delegate applications for IARE MUN 2026 will be live shortly.
              </p>
              <div className="updates-box">
                <p>Stay tuned for updates!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Registration;
