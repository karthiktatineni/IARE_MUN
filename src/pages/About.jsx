import './About.css';

function About() {
  return (
    <div className="about">
      <section className="page-header animate-on-load">
        <div className="container">
          <h1>About IARE MUN</h1>
          <p className="head">
            Empowering future leaders through diplomacy and debate
          </p>

        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-card animate-on-load delay-100">
            <div className="content-block">
              <h2 className="head">What is Model United Nations?</h2>

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
          </div>

          <div className="about-card animate-on-load delay-200">
            <div className="content-block">
              <h2 className="head">About IARE</h2>
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
          </div>
          <div className="about-card animate-on-load delay-400">
            <div className="content-block">
              <h2 className="head">IARE MUN 2026</h2>
              <p>
                IARE MUN 2026 is a 3-day conference bringing together students from various
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
          </div>


          <div className="about-card animate-on-load delay-300">
            <div className="content-block">
              <h2 className="head">Message from Secretary General</h2>

              <p>
                IARE Model United Nations 2026 represents a continued advancement in our
                efforts to promote diplomatic thinking, meaningful dialogue, and global
                awareness among young scholars. As Secretary-General, I, Karthik Tatineni,
                am honored to welcome you to this distinguished conference that brings
                together passionate minds committed to dialogue, diplomacy, and global
                understanding.
              </p>

              <p>
                IARE MUN is more than a simulation of international relations. It is a
                dynamic platform where ideas are examined, perspectives are challenged,
                and leadership is cultivated through respectful debate and collaboration.
                In a world marked by rapid change and complex global challenges, forums
                such as this play a vital role in nurturing informed, responsible, and
                empathetic future leaders.
              </p>

              <p>
                This conference encourages delegates to think beyond conventions, engage
                deeply with global issues, and collaborate toward innovative and inclusive
                solutions. Each committee session offers an opportunity not only to
                represent nations, but also to understand the responsibilities that
                accompany leadership, negotiation, and decision-making.
              </p>

              <p>
                IARE MUN 2026 reflects the dedication of our Secretariat, the steadfast
                support of our institution, and the enthusiasm of delegates who bring this
                conference to life. Your preparation, participation, and passion are what
                transform debate into meaningful impact.
              </p>

              <p>
                I encourage every delegate to participate with confidence, listen with
                intent, and engage with integrity. May this conference inspire new
                perspectives, meaningful dialogue, and a lasting commitment to global
                citizenship.
              </p>

              <p>
                <strong>Welcome to IARE Model United Nations 2026.</strong><br />
                <strong>Let the deliberations begin.</strong>
              </p>

              <div className="signature-block">
                <p>Regards,</p>
                <p><strong>Karthik Tatineni</strong></p>
                <p>Secretary-General</p>
                <p>IARE Model United Nations - 2026</p>
              </div>
            </div>
          </div>

          <div className="objectives-grid animate-on-load delay-400">
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
