import './About.css';

function About() {
  return (
    <div className="about">
      <section className="page-header">
        <div className="container">
          <h1>About IARE MUN</h1>
          <p>Empowering future leaders through diplomacy and debate</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="content-block">
            <h2>What is Model United Nations?</h2>
            <p>
              Model United Nations (MUN) is an educational simulation where students learn about
              diplomacy, international relations, and the United Nations. In MUN, students take on
              the roles of delegates from different countries and attempt to solve real-world
              problems with the policies and perspectives of their assigned country.
            </p>
            <p>
              Participants research, debate, deliberate, and develop solutions to world issues
              through the lens of their assigned country. The skills developed through MUN include
              public speaking, research, writing, critical thinking, teamwork, leadership, and
              negotiation.
            </p>
          </div>

          <div className="content-block">
            <h2>About IARE</h2>
            <p>
              The Institute of Aeronautical Engineering (IARE) is a leading technical institution
              committed to excellence in education, research, and innovation. Located in Hyderabad,
              IARE has established itself as a premier institution fostering academic excellence and
              holistic development.
            </p>
            <p>
              IARE focuses on providing quality education in engineering and technology while
              encouraging students to participate in co-curricular activities that develop their
              leadership, communication, and critical thinking skills. The MUN conference is one
              such initiative that aligns with the institution&apos;s vision of creating global citizens.
            </p>
          </div>

          <div className="content-block">
            <h2>IARE MUN 2024</h2>
            <p>
              IARE MUN 2024 is a 3-day conference bringing together students from various
              institutions to engage in meaningful debates and discussions on pressing global issues.
              The conference features three distinct committees, each focusing on different aspects
              of international relations and domestic policy.
            </p>
            <p>
              Through intense committee sessions, delegates will have the opportunity to represent
              their assigned countries, draft resolutions, form alliances, and work towards
              diplomatic solutions. The conference aims to provide a platform for young minds to
              showcase their diplomatic skills and contribute to finding solutions to real-world
              problems.
            </p>
          </div>

          <div className="objectives-grid">
            <div className="objective-card">
              <h3>🎯 Our Mission</h3>
              <p>
                To provide students with an immersive diplomatic experience that enhances their
                understanding of global affairs and develops essential leadership skills.
              </p>
            </div>
            <div className="objective-card">
              <h3>👁️ Our Vision</h3>
              <p>
                To create a platform where future leaders can engage in meaningful dialogue,
                foster international understanding, and develop solutions to global challenges.
              </p>
            </div>
            <div className="objective-card">
              <h3>💡 Our Values</h3>
              <p>
                Integrity, diplomacy, respect, collaboration, and excellence in all aspects
                of debate and negotiation.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
