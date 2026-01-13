import './Secretariat.css';

function Secretariat() {
  const teamMembers = [
    {
      name: 'TATINENI KARTHIK SAI',
      position: 'Secretary General',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'KONDA NAGA SATHVIKA',
      position: 'Deputy Secretary General',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'SILAR SAI CHARAN',
      position: 'Director General',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'M CHAITANYA REDDY',
      position: 'OC Head',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'AMULYA VEGESNA',
      position: 'USG Finance',
      image: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'PRAGNESH VANGETY',
      position: 'USG Hospitality',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'S SAI ABHINAV',
      position: 'USG Delegate Relations',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'LUCKY RAO',
      position: 'USG PR & Promotions',
      image: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'Rohan Gupta',
      position: 'USG Tech',
      image: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'MONICA JAMPA',
      position: 'USG Design',
      image: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'SOWMYA KUMARI',
      position: 'USG Documentation',
      image: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400'
    },
    {
      name: 'ANRAG EDIGI',
      position: 'USG Video',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400'
    }
  ];

  return (
    <div className="secretariat">
      <section className="page-header">
        <div className="container">
          <h1>Secretariat</h1>
          <p>Meet the team behind IARE MUN 2024</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <p className="intro-text">
            The Secretariat is the driving force behind IARE MUN 2024. Our dedicated team of
            student leaders has worked tirelessly to ensure a memorable and enriching experience
            for all delegates. Each member brings unique skills and passion to make this conference
            a success.
          </p>

          <div className="team-grid">
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

export default Secretariat;
