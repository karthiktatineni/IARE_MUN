import './Committees.css';

function Committees() {
  return (
    <div className="committees">
      <section className="page-header">
        <div className="container">
          <h1>Committees</h1>
          <p>Explore the three dynamic committees of IARE MUN 2024</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="committee-card">
            <div className="committee-header">
              <h2>United Nations Security Council (UNSC)</h2>
              <span className="committee-badge">International</span>
            </div>
            <div className="committee-content">
              <p className="committee-intro">
                The United Nations Security Council is one of the six principal organs of the
                United Nations, charged with ensuring international peace and security.
              </p>

              <div className="committee-details">
                <div className="detail-section">
                  <h3>About the Committee</h3>
                  <p>
                    The Security Council has primary responsibility for the maintenance of
                    international peace and security. It has 15 Members, and each Member has one
                    vote. Under the Charter of the United Nations, all Member States are obligated
                    to comply with Council decisions.
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Agenda</h3>
                  <p>
                    Addressing threats to international peace and security, with focus on
                    contemporary conflicts and peacekeeping operations. The committee will debate
                    resolutions and work towards diplomatic solutions.
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Key Responsibilities</h3>
                  <ul>
                    <li>Maintain international peace and security</li>
                    <li>Investigate disputes and situations</li>
                    <li>Recommend methods of adjusting disputes</li>
                    <li>Formulate plans for peacekeeping operations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="committee-card">
            <div className="committee-header">
              <h2>Disarmament and International Security Committee - DISEC</h2>
              <span className="committee-badge">Disarmament</span>
            </div>
            <div className="committee-content">
              <p className="committee-intro">
                The Disarmament and International Security Committee (DISEC) is the First
                Committee of the UN General Assembly.
              </p>

              <div className="committee-details">
                <div className="detail-section">
                  <h3>About the Committee</h3>
                  <p>
                    DISEC deals with disarmament, global challenges and threats to peace that
                    affect the international community. It seeks out solutions to the challenges
                    in the international security regime.
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Agenda</h3>
                  <p>
                    Discussion on disarmament, arms control, and international security issues.
                    Topics include nuclear non-proliferation, conventional weapons, and emerging
                    security threats in the modern era.
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Key Focus Areas</h3>
                  <ul>
                    <li>Nuclear disarmament and non-proliferation</li>
                    <li>Conventional weapons regulations</li>
                    <li>Cybersecurity and emerging technologies</li>
                    <li>Space security and militarization</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="committee-card">
            <div className="committee-header">
              <h2>All India Political Parties Meet (AIPPM)</h2>
              <span className="committee-badge">National</span>
            </div>
            <div className="committee-content">
              <p className="committee-intro">
                A unique platform bringing together India&apos;s major political parties to discuss
                and debate pressing national issues.
              </p>

              <div className="committee-details">
                <div className="detail-section">
                  <h3>About the Committee</h3>
                  <p>
                    AIPPM provides a forum for representatives of all major Indian political parties
                    to come together and discuss national issues, policies, and governance matters
                    in a collaborative environment.
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Agenda</h3>
                  <p>
                    Deliberation on crucial domestic policy matters affecting India. Delegates will
                    represent various political parties and work towards consensus on national
                    issues while maintaining their party&apos;s ideology and stance.
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Discussion Topics</h3>
                  <ul>
                    <li>Economic development and reforms</li>
                    <li>Social welfare and inclusive growth</li>
                    <li>Education and healthcare policies</li>
                    <li>Environmental concerns and sustainability</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="committee-card">
            <div className="committee-header">
              <h2>International Press (IP)</h2>
              <span className="committee-badge">International</span>
            </div>
            <div className="committee-content">
              <p className="committee-intro">
                The International Press (IP) represents the media body of the Model United Nations conference.
              </p>

              <div className="committee-details">
                <div className="detail-section">
                  <h3>About the Committee</h3>
                  <p>
                    The International Press functions as the journalistic arm of the conference, responsible for documenting committee proceedings and shaping public narratives. It plays a vital role in ensuring transparency, accountability, and communication by reporting on debates, resolutions, and diplomatic developments.
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Agenda</h3>
                  <p>
                    Coverage and analysis of committee sessions through written articles, interviews, photographs, and digital media. The International Press focuses on accurate reporting, critical evaluation, and ethical journalism while capturing the essence of diplomacy in action.
                  </p>
                </div>

                <div className="detail-section">
                  <h3>Key Responsibilities</h3>
                  <ul>
                    <li>Reporting and investigative journalism</li>
                    <li>Editorial writing and opinion pieces</li>
                    <li>Photography and visual documentation</li>
                    <li>Media ethics, press freedom, and responsible communication</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Committees;
