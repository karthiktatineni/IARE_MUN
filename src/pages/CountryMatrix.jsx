import { useState, useEffect } from 'react';
import './CountryMatrix.css';

function CountryMatrix() {
  const [countryData, setCountryData] = useState({
    UNSC: [],
    DISEC: [],
    AIPPM: [],
    IP: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedCommittee, setSelectedCommittee] = useState('UNSC');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const staticCountryData = {
    UNSC: [
      { country: 'China', is_allocated: false, allocated_to: null },
      { country: 'France', is_allocated: false, allocated_to: null },
      { country: 'Russian Federation', is_allocated: false, allocated_to: null },
      { country: 'United Kingdom', is_allocated: false, allocated_to: null },
      { country: 'United States', is_allocated: false, allocated_to: null },
      { country: 'Afghanistan', is_allocated: false, allocated_to: null },
      { country: 'Albania', is_allocated: false, allocated_to: null },
      { country: 'Algeria', is_allocated: false, allocated_to: null },
      { country: 'Angola', is_allocated: false, allocated_to: null },
      { country: 'Argentina', is_allocated: false, allocated_to: null },
      { country: 'Australia', is_allocated: false, allocated_to: null },
      { country: 'Austria', is_allocated: false, allocated_to: null },
      { country: 'Bahrain', is_allocated: false, allocated_to: null },
      { country: 'Bangladesh', is_allocated: false, allocated_to: null },
      { country: 'Belgium', is_allocated: false, allocated_to: null },
      { country: 'Bolivia', is_allocated: false, allocated_to: null },
      { country: 'Brazil', is_allocated: false, allocated_to: null },
      { country: 'Bulgaria', is_allocated: false, allocated_to: null },
      { country: 'Canada', is_allocated: false, allocated_to: null },
      { country: 'Chile', is_allocated: false, allocated_to: null },
      { country: 'Colombia', is_allocated: false, allocated_to: null },
      { country: 'Costa Rica', is_allocated: false, allocated_to: null },
      { country: 'Croatia', is_allocated: false, allocated_to: null },
      { country: 'Cuba', is_allocated: false, allocated_to: null },
      { country: 'Cyprus', is_allocated: false, allocated_to: null },
      { country: 'Democratic Republic of the Congo', is_allocated: false, allocated_to: null },
      { country: 'Denmark', is_allocated: false, allocated_to: null },
      { country: 'Ecuador', is_allocated: false, allocated_to: null },
      { country: 'Egypt', is_allocated: false, allocated_to: null },
      { country: 'Estonia', is_allocated: false, allocated_to: null },
      { country: 'Ethiopia', is_allocated: false, allocated_to: null },
      { country: 'Finland', is_allocated: false, allocated_to: null },
      { country: 'Gabon', is_allocated: false, allocated_to: null },
      { country: 'Ghana', is_allocated: false, allocated_to: null },
      { country: 'Greece', is_allocated: false, allocated_to: null },
      { country: 'Guatemala', is_allocated: false, allocated_to: null },
      { country: 'Honduras', is_allocated: false, allocated_to: null },
      { country: 'Hungary', is_allocated: false, allocated_to: null },
      { country: 'Iceland', is_allocated: false, allocated_to: null },
      { country: 'India', is_allocated: false, allocated_to: null },
      { country: 'Indonesia', is_allocated: false, allocated_to: null },
      { country: 'Iran', is_allocated: false, allocated_to: null },
      { country: 'Iraq', is_allocated: false, allocated_to: null },
      { country: 'Ireland', is_allocated: false, allocated_to: null },
      { country: 'Italy', is_allocated: false, allocated_to: null },
      { country: 'Jamaica', is_allocated: false, allocated_to: null },
      { country: 'Japan', is_allocated: false, allocated_to: null },
      { country: 'Jordan', is_allocated: false, allocated_to: null },
      { country: 'Kazakhstan', is_allocated: false, allocated_to: null },
      { country: 'Kenya', is_allocated: false, allocated_to: null },
      { country: 'Kuwait', is_allocated: false, allocated_to: null },
      { country: 'Latvia', is_allocated: false, allocated_to: null },
      { country: 'Lebanon', is_allocated: false, allocated_to: null },
      { country: 'Liberia', is_allocated: false, allocated_to: null },
      { country: 'Libya', is_allocated: false, allocated_to: null },
      { country: 'Lithuania', is_allocated: false, allocated_to: null },
      { country: 'Luxembourg', is_allocated: false, allocated_to: null },
      { country: 'Malaysia', is_allocated: false, allocated_to: null },
      { country: 'Maldives', is_allocated: false, allocated_to: null },
      { country: 'Mexico', is_allocated: false, allocated_to: null },
      { country: 'Morocco', is_allocated: false, allocated_to: null },
      { country: 'Namibia', is_allocated: false, allocated_to: null },
      { country: 'Nepal', is_allocated: false, allocated_to: null },
      { country: 'Netherlands', is_allocated: false, allocated_to: null },
      { country: 'New Zealand', is_allocated: false, allocated_to: null },
      { country: 'Nigeria', is_allocated: false, allocated_to: null },
      { country: 'Norway', is_allocated: false, allocated_to: null },
      { country: 'Pakistan', is_allocated: false, allocated_to: null },
      { country: 'Panama', is_allocated: false, allocated_to: null },
      { country: 'Peru', is_allocated: false, allocated_to: null },
      { country: 'Philippines', is_allocated: false, allocated_to: null },
      { country: 'Poland', is_allocated: false, allocated_to: null },
      { country: 'Portugal', is_allocated: false, allocated_to: null },
      { country: 'Qatar', is_allocated: false, allocated_to: null },
      { country: 'Romania', is_allocated: false, allocated_to: null },
      { country: 'Saudi Arabia', is_allocated: false, allocated_to: null },
      { country: 'Senegal', is_allocated: false, allocated_to: null },
      { country: 'Somalia', is_allocated: false, allocated_to: null },
      { country: 'South Africa', is_allocated: false, allocated_to: null },
      { country: 'Thailand', is_allocated: false, allocated_to: null },
      { country: 'Tunisia', is_allocated: false, allocated_to: null },
      { country: 'Turkey', is_allocated: false, allocated_to: null },
      { country: 'Uganda', is_allocated: false, allocated_to: null },
      { country: 'Ukraine', is_allocated: false, allocated_to: null },
      { country: 'United Arab Emirates', is_allocated: false, allocated_to: null },
      { country: 'Uruguay', is_allocated: false, allocated_to: null },
      { country: 'Venezuela', is_allocated: false, allocated_to: null },
      { country: 'Zimbabwe', is_allocated: false, allocated_to: null }
    ],
    DISEC: [
      { country: 'China', is_allocated: false, allocated_to: null },
      { country: 'France', is_allocated: false, allocated_to: null },
      { country: 'Russian Federation', is_allocated: false, allocated_to: null },
      { country: 'United Kingdom', is_allocated: false, allocated_to: null },
      { country: 'United States', is_allocated: false, allocated_to: null },
      { country: 'Afghanistan', is_allocated: false, allocated_to: null },
      { country: 'Albania', is_allocated: false, allocated_to: null },
      { country: 'Algeria', is_allocated: false, allocated_to: null },
      { country: 'Angola', is_allocated: false, allocated_to: null },
      { country: 'Argentina', is_allocated: false, allocated_to: null },
      { country: 'Australia', is_allocated: false, allocated_to: null },
      { country: 'Austria', is_allocated: false, allocated_to: null },
      { country: 'Bahrain', is_allocated: false, allocated_to: null },
      { country: 'Bangladesh', is_allocated: false, allocated_to: null },
      { country: 'Belgium', is_allocated: false, allocated_to: null },
      { country: 'Bolivia', is_allocated: false, allocated_to: null },
      { country: 'Brazil', is_allocated: false, allocated_to: null },
      { country: 'Bulgaria', is_allocated: false, allocated_to: null },
      { country: 'Canada', is_allocated: false, allocated_to: null },
      { country: 'Chile', is_allocated: false, allocated_to: null },
      { country: 'Colombia', is_allocated: false, allocated_to: null },
      { country: 'Costa Rica', is_allocated: false, allocated_to: null },
      { country: 'Croatia', is_allocated: false, allocated_to: null },
      { country: 'Cuba', is_allocated: false, allocated_to: null },
      { country: 'Cyprus', is_allocated: false, allocated_to: null },
      { country: 'Democratic Republic of the Congo', is_allocated: false, allocated_to: null },
      { country: 'Denmark', is_allocated: false, allocated_to: null },
      { country: 'Ecuador', is_allocated: false, allocated_to: null },
      { country: 'Egypt', is_allocated: false, allocated_to: null },
      { country: 'Estonia', is_allocated: false, allocated_to: null },
      { country: 'Ethiopia', is_allocated: false, allocated_to: null },
      { country: 'Finland', is_allocated: false, allocated_to: null },
      { country: 'Gabon', is_allocated: false, allocated_to: null },
      { country: 'Ghana', is_allocated: false, allocated_to: null },
      { country: 'Greece', is_allocated: false, allocated_to: null },
      { country: 'Guatemala', is_allocated: false, allocated_to: null },
      { country: 'Honduras', is_allocated: false, allocated_to: null },
      { country: 'Hungary', is_allocated: false, allocated_to: null },
      { country: 'Iceland', is_allocated: false, allocated_to: null },
      { country: 'India', is_allocated: false, allocated_to: null },
      { country: 'Indonesia', is_allocated: false, allocated_to: null },
      { country: 'Iran', is_allocated: false, allocated_to: null },
      { country: 'Iraq', is_allocated: false, allocated_to: null },
      { country: 'Ireland', is_allocated: false, allocated_to: null },
      { country: 'Italy', is_allocated: false, allocated_to: null },
      { country: 'Jamaica', is_allocated: false, allocated_to: null },
      { country: 'Japan', is_allocated: false, allocated_to: null },
      { country: 'Jordan', is_allocated: false, allocated_to: null },
      { country: 'Kazakhstan', is_allocated: false, allocated_to: null },
      { country: 'Kenya', is_allocated: false, allocated_to: null },
      { country: 'Kuwait', is_allocated: false, allocated_to: null },
      { country: 'Latvia', is_allocated: false, allocated_to: null },
      { country: 'Lebanon', is_allocated: false, allocated_to: null },
      { country: 'Liberia', is_allocated: false, allocated_to: null },
      { country: 'Libya', is_allocated: false, allocated_to: null },
      { country: 'Lithuania', is_allocated: false, allocated_to: null },
      { country: 'Luxembourg', is_allocated: false, allocated_to: null },
      { country: 'Malaysia', is_allocated: false, allocated_to: null },
      { country: 'Maldives', is_allocated: false, allocated_to: null },
      { country: 'Mexico', is_allocated: false, allocated_to: null },
      { country: 'Morocco', is_allocated: false, allocated_to: null },
      { country: 'Namibia', is_allocated: false, allocated_to: null },
      { country: 'Nepal', is_allocated: false, allocated_to: null },
      { country: 'Netherlands', is_allocated: false, allocated_to: null },
      { country: 'New Zealand', is_allocated: false, allocated_to: null },
      { country: 'Nigeria', is_allocated: false, allocated_to: null },
      { country: 'Norway', is_allocated: false, allocated_to: null },
      { country: 'Pakistan', is_allocated: false, allocated_to: null },
      { country: 'Panama', is_allocated: false, allocated_to: null },
      { country: 'Peru', is_allocated: false, allocated_to: null },
      { country: 'Philippines', is_allocated: false, allocated_to: null },
      { country: 'Poland', is_allocated: false, allocated_to: null },
      { country: 'Portugal', is_allocated: false, allocated_to: null },
      { country: 'Qatar', is_allocated: false, allocated_to: null },
      { country: 'Romania', is_allocated: false, allocated_to: null },
      { country: 'Saudi Arabia', is_allocated: false, allocated_to: null },
      { country: 'Senegal', is_allocated: false, allocated_to: null },
      { country: 'Somalia', is_allocated: false, allocated_to: null },
      { country: 'South Africa', is_allocated: false, allocated_to: null },
      { country: 'Thailand', is_allocated: false, allocated_to: null },
      { country: 'Tunisia', is_allocated: false, allocated_to: null },
      { country: 'Turkey', is_allocated: false, allocated_to: null },
      { country: 'Uganda', is_allocated: false, allocated_to: null },
      { country: 'Ukraine', is_allocated: false, allocated_to: null },
      { country: 'United Arab Emirates', is_allocated: false, allocated_to: null },
      { country: 'Uruguay', is_allocated: false, allocated_to: null },
      { country: 'Venezuela', is_allocated: false, allocated_to: null },
      { country: 'Zimbabwe', is_allocated: false, allocated_to: null }
    ],
    AIPPM: [
      { country: 'Nirmala Sitharaman', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Finance', is_allocated: false, allocated_to: null },
      { country: 'Amit Shah', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Home Affairs', is_allocated: false, allocated_to: null },
      { country: 'Dharmendra Pradhan', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Education', is_allocated: false, allocated_to: null },
      { country: 'Dr. Subrahmanyam Jaishankar', portfolio: 'Bharatiya Janata Party', minister: 'Minister of External Affairs', is_allocated: false, allocated_to: null },
      { country: 'Ashwini Vaishnaw', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Information & Broadcasting', is_allocated: false, allocated_to: null },
      { country: 'Anupriya Devi', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Women & Child Development', is_allocated: false, allocated_to: null },
      { country: 'Jyotiraditya M. Scindia', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Development of North Eastern Region', is_allocated: false, allocated_to: null },
      { country: 'Jagat Prakash Nadda', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Health', is_allocated: false, allocated_to: null },
      { country: 'Tejasvi Surya', portfolio: 'Bharatiya Janata Party', minister: 'Member of Parliament, Bengaluru South', is_allocated: false, allocated_to: null },
      { country: 'Rajnath Singh', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Defence', is_allocated: false, allocated_to: null },
      { country: 'K Annamalai', portfolio: 'Bharatiya Janata Party', minister: 'Political Leader', is_allocated: false, allocated_to: null },
      { country: 'Yogi Adityanath', portfolio: 'Bharatiya Janata Party', minister: 'Chief Minister of Uttar Pradesh', is_allocated: false, allocated_to: null },
      { country: 'Kangana Ranaut', portfolio: 'Bharatiya Janata Party', minister: 'Member of Parliament, Mandi', is_allocated: false, allocated_to: null },
      { country: 'Eknath Shinde', portfolio: 'Shiv Sena', minister: 'Chief Minister of Maharashtra', is_allocated: false, allocated_to: null },
      { country: 'Chirag Paswan', portfolio: 'Lok Janshakti Party (Ram Vilas)', minister: 'Minister of Food Processing Industries', is_allocated: false, allocated_to: null },
      { country: 'Edapaddi Palaniswami', portfolio: 'All India Anna Dravida M', minister: 'Minister of Food Processing Industries', is_allocated: false, allocated_to: null },
      { country: 'Edapaddi Palaniswami', portfolio: 'All India  Party', minister: 'Member of Parliament, Mandi', is_allocated: false, allocated_to: null },
      { country: 'Eknath Shinde', portfolio: 'Shiv Sena', minister: 'Chief Minister of Maharashtra', is_allocated: false, allocated_to: null },
      { country: 'Chirag Paswan', portfolio: 'Lok Janshakti Party (Ram Vilas)', minister: 'Minister of Food Processing Industries', is_allocated: false, allocated_to: null },
      { country: 'Edapaddi Palaniswami', portfolio: 'All India Anna Dravida Munnetra Kazhagam', minister: 'Leader of Opposition, Tamil Nadu Legislative Assembly', is_allocated: false, allocated_to: null },
      { country: 'H.D. Kumaraswamy', portfolio: 'Janata Dal (Secular)', minister: 'Minister of Heavy Industries & Steel', is_allocated: false, allocated_to: null },
      { country: 'Nitish Kumar', portfolio: 'Janata Dal (United)', minister: 'Chief Minister of Bihar', is_allocated: false, allocated_to: null },
      { country: 'Nara Chandrababu Naidu', portfolio: 'Telugu Desam Party', minister: 'Chief Minister of Andhra Pradesh', is_allocated: false, allocated_to: null },
      { country: 'Jayant Chaudhary', portfolio: 'Rashtriya Lok Dal', minister: 'Minister of State, Education', is_allocated: false, allocated_to: null },
      { country: 'Ramdas Athawale', portfolio: 'Republican Party of India (Athawale)', minister: 'Minister of Social Justice & Empowerment', is_allocated: false, allocated_to: null },
      { country: 'Rahul Gandhi', portfolio: 'Indian National Congress', minister: 'Leader of Opposition', is_allocated: false, allocated_to: null },
      { country: 'Mallikarjun Kharge', portfolio: 'Indian National Congress', minister: 'Member of Parliament', is_allocated: false, allocated_to: null },
      { country: 'Siddaramaiah', portfolio: 'Indian National Congress', minister: 'Chief Minister of Karnataka', is_allocated: false, allocated_to: null },
      { country: 'D.K. Shivakumar', portfolio: 'Indian National Congress', minister: 'Deputy Chief Minister of Karnataka', is_allocated: false, allocated_to: null },
      { country: 'Priyanka Gandhi Vadra', portfolio: 'Indian National Congress', minister: 'Member of Parliament, Wayanad', is_allocated: false, allocated_to: null },
      { country: 'Shashi Tharoor', portfolio: 'Indian National Congress', minister: 'Member of Parliament, Thiruvananthapuram', is_allocated: false, allocated_to: null },
      { country: 'Revanth Reddy', portfolio: 'Indian National Congress', minister: 'Chief Minister of Telangana', is_allocated: false, allocated_to: null },
      { country: 'Atishi Marlena', portfolio: 'Aam Aadmi Party', minister: 'Minister of Education, Delhi', is_allocated: false, allocated_to: null },
      { country: 'Pinarayi Vijayan', portfolio: 'Communist Party of India (Marxist)', minister: 'Chief Minister of Kerala', is_allocated: false, allocated_to: null },
      { country: 'Uddhav Balasaheb Thackeray', portfolio: 'Shiv Sena (UBT)', minister: 'Member of Legislative Council, Maharashtra', is_allocated: false, allocated_to: null },
      { country: 'M.K. Stalin', portfolio: 'Dravida Munnetra Kazhagam', minister: 'Chief Minister of Tamil Nadu', is_allocated: false, allocated_to: null },
      { country: 'Udhayanidhi Stalin', portfolio: 'Dravida Munnetra Kazhagam', minister: 'Minister of Youth Welfare and Sports Development of Tamil Nadu', is_allocated: false, allocated_to: null },
      { country: 'Omar Abdullah', portfolio: 'Jammu & Kashmir National Conference', minister: 'Chief Minister of Jammu and Kashmir', is_allocated: false, allocated_to: null },
      { country: 'Mehbooba Mufti', portfolio: 'Jammu & Kashmir People\'s Democratic Party', minister: 'Political Leader', is_allocated: false, allocated_to: null },
      { country: 'Hemant Soren', portfolio: 'Jharkhand Mukti Morcha', minister: 'Chief Minister of Jharkhand', is_allocated: false, allocated_to: null },
      { country: 'Asaduddin Owaisi', portfolio: 'All India Majlis-e-Ittehadul Muslimeen', minister: 'Member of Parliament, Hyderabad', is_allocated: false, allocated_to: null },
      { country: 'YS Jagan Mohan Reddy', portfolio: 'Yuvajana Sramika Rythu Congress Party', minister: 'Member of Legislative Assembly, Pulivendula', is_allocated: false, allocated_to: null },
      { country: 'Akhilesh Yadav', portfolio: 'Samajwadi Party', minister: 'Political Leader', is_allocated: false, allocated_to: null },
      { country: 'K Chandrashekar Rao', portfolio: 'Bharat Rashtra Samithi', minister: 'Leader of Opposition, Telangana', is_allocated: false, allocated_to: null },
      { country: 'Sachin Pilot', portfolio: 'Indian National Congress', minister: 'Member of Parliament, Dausa', is_allocated: false, allocated_to: null },
      { country: 'Mamata Banerjee', portfolio: 'All India Trinamool Congress', minister: 'Chief Minister of West Bengal', is_allocated: false, allocated_to: null }
    ],
    IP: [
      { country: 'Reporter', is_allocated: false, allocated_to: null },
      { country: 'Photo Journalist', is_allocated: false, allocated_to: null }
    ]
  };

  useEffect(() => {
    // Simulate loading delay
    setLoading(true);
    setTimeout(() => {
      setCountryData(staticCountryData);
      setLoading(false);
    }, 1000);
  }, []);

  // Function to toggle allocation status (for demo purposes)
  const toggleAllocation = (committee, countryIndex) => {
    setCountryData(prevData => {
      const newData = { ...prevData };
      const country = newData[committee][countryIndex];

      if (country.is_allocated) {
        country.is_allocated = false;
        country.allocated_to = null;
      } else {
        country.is_allocated = true;
        country.allocated_to = 'Demo User';
      }

      return newData;
    });
  };

  // Function to filter countries based on search and status
  const getFilteredCountries = (committee) => {
    let countries = countryData[committee] || [];

    // Filter by search term
    if (searchTerm) {
      countries = countries.filter(country =>
        country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (country.allocated_to && country.allocated_to.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (country.portfolio && country.portfolio.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (country.minister && country.minister.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (filterStatus === 'available') {
      countries = countries.filter(country => !country.is_allocated);
    } else if (filterStatus === 'allocated') {
      countries = countries.filter(country => country.is_allocated);
    }

    return countries;
  };

  const getStats = (committee) => {
    const allCountries = countryData[committee] || [];
    const filteredCountries = getFilteredCountries(committee);
    const total = allCountries.length;
    const allocated = allCountries.filter(c => c.is_allocated).length;
    const available = total - allocated;
    const filteredTotal = filteredCountries.length;

    return {
      total,
      allocated,
      available,
      filteredTotal,
      showingFiltered: filteredTotal !== total || searchTerm || filterStatus !== 'all'
    };
  };

  return (
    <div className="country-matrix">
      <section className="page-header">
        <div className="container">
          <h1>Country Matrix</h1>
          <p>Check country/party availability for each committee</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="committee-tabs">
            {Object.keys(countryData).map(committee => {
              const stats = getStats(committee);
              return (
                <button
                  key={committee}
                  className={`tab-button ${selectedCommittee === committee ? 'active' : ''}`}
                  onClick={() => setSelectedCommittee(committee)}
                >
                  <span className="tab-name">{committee}</span>
                  <span className="tab-stats">
                    {stats.available}/{stats.total} Available
                  </span>
                </button>
              );
            })}
          </div>

          <div className="controls-section">
            <div className="search-filter-container">
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search countries or delegates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="filter-buttons">
                <button
                  className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'available' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('available')}
                >
                  Available
                </button>
                <button
                  className={`filter-btn ${filterStatus === 'allocated' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('allocated')}
                >
                  Allocated
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading country data...</p>
            </div>
          ) : (
            <div className="matrix-container">
              <div className="stats-summary">
                <div className="stat-box">
                  <div className="stat-label">Total</div>
                  <div className="stat-value">{getStats(selectedCommittee).total}</div>
                </div>
                <div className="stat-box available">
                  <div className="stat-label">Available</div>
                  <div className="stat-value">{getStats(selectedCommittee).available}</div>
                </div>
                <div className="stat-box allocated">
                  <div className="stat-label">Allocated</div>
                  <div className="stat-value">{getStats(selectedCommittee).allocated}</div>
                </div>
              </div>

              <div className="legend">
                <div className="legend-item">
                  <span className="legend-indicator available"></span>
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <span className="legend-indicator allocated"></span>
                  <span>Allocated</span>
                </div>
              </div>

              <div className="countries-grid">
                {getFilteredCountries(selectedCommittee).length === 0 ? (
                  <div className="no-results">
                    <p>No countries found matching your criteria.</p>
                  </div>
                ) : (
                  getFilteredCountries(selectedCommittee).map((item, index) => {
                    const originalIndex = countryData[selectedCommittee].findIndex(
                      country => country.country === item.country
                    );
                    return (
                      <div
                        key={index}
                        className={`country-card ${item.is_allocated ? 'allocated' : 'available'} ${selectedCommittee === 'AIPPM' ? 'aippm-card' : ''}`}
                        onClick={() => toggleAllocation(selectedCommittee, originalIndex)}
                        title="Click to toggle allocation status"
                      >
                        <div className="country-name">{item.country}</div>
                        {selectedCommittee === 'AIPPM' && (
                          <div className="aippm-details">
                            <div className="portfolio">{item.portfolio}</div>
                            <div className="minister">{item.minister}</div>
                          </div>
                        )}
                        <div className="country-status">
                          {item.is_allocated ? (
                            <>
                              <span className="status-badge">Allocated</span>
                              {item.allocated_to && (
                                <span className="allocated-to">to {item.allocated_to}</span>
                              )}
                            </>
                          ) : (
                            <span className="status-badge available">Available</span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CountryMatrix;