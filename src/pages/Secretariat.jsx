import './Secretariat.css';

/*
function Secretariat() {
  const teamMembers = [
    {
      name: 'TATINENI KARTHIK SAI',
      position: 'Secretary General',
      image: ''
    },
    {
      name: 'KONDA NAGA SATHVIKA',
      position: 'Deputy Secretary General',
      image: ''
    },
    {
      name: 'SILAR SAI CHARAN',
      position: 'Director General',
      image: ''
    },
    {
      name: 'M CHAITANYA REDDY',
      position: 'OC Head',
      image: ''
    },
    {
      name: 'AMULYA VEGESNA',
      position: 'USG Finance',
      image: ''
    },
    {
      name: 'PRAGNESH VANGETY',
      position: 'USG Hospitality',
      image: ''
    },
    {
      name: 'S SAI ABHINAV',
      position: 'USG Delegate Relations',
      image: ''
    },
    {
      name: 'LUCKY RAO',
      position: 'USG PR & Promotions',
      image: ''
    },
    {
      name: 'Rohan Gupta',
      position: 'USG Tech',
      image: ''
    },
    {
      name: 'MONICA JAMPA',
      position: 'USG Design',
      image: ''
    },
    {
      name: 'SOWMYA KUMARI',
      position: 'USG Documentation',
      image: ''
    },
    {
      name: 'ANRAG EDIGI',
      position: 'USG Video',
      image: ''
    }
  ];

  return (
    <div className="secretariat">
      <section className="page-header animate-on-load">
        <div className="container">
          <h1>Secretariat</h1>
          <p className="head">Meet the team behind IARE MUN 2026</p>
        </div>
      </section>

      <section className="section">
        <div className="container">


          <div className="team-grid animate-on-load delay-300">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="team-image-container">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="team-image"
                  />
                </div>
                <div className="team-info">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-position">{member.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
*/

function Secretariat() {
  return (
    <div className="secretariat">
      <section className="page-header animate-on-load">
        <div className="container">
          <h1>Secretariat</h1>
          <p className="head">IARE MUN 2026</p>
        </div>
      </section>

      <section className="section revealing-soon-section">
        <div className="container">
          <div className="revealing-soon-content">
            <div className="soon-card">
              <h2>Revealing Soon</h2>
              <p className="soon-text">
                The powerhouse behind IARE MUN 2026 is being finalized.
                Stay tuned to meet the visionaries and leaders of this year&apos;s conference.
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

export default Secretariat;

