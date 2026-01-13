import { useState, useEffect } from 'react';
import { staticCountryData } from '../data/committees';
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

<<<<<<< HEAD
=======
  const staticCountryData = {
    UNSC: [
      { country: 'China' },
      { country: 'France' },
      { country: 'Russian Federation' },
      { country: 'United Kingdom' },
      { country: 'United States' },
      { country: 'Afghanistan' },
      { country: 'Albania' },
      { country: 'Algeria' },
      { country: 'Angola' },
      { country: 'Argentina' },
      { country: 'Australia' },
      { country: 'Austria' },
      { country: 'Bahrain' },
      { country: 'Bangladesh' },
      { country: 'Belgium' },
      { country: 'Bolivia' },
      { country: 'Brazil' },
      { country: 'Bulgaria' },
      { country: 'Canada' },
      { country: 'Chile' },
      { country: 'Colombia' },
      { country: 'Costa Rica' },
      { country: 'Croatia' },
      { country: 'Cuba' },
      { country: 'Cyprus' },
      { country: 'Democratic Republic of the Congo' },
      { country: 'Denmark' },
      { country: 'Ecuador' },
      { country: 'Egypt' },
      { country: 'Estonia' },
      { country: 'Ethiopia' },
      { country: 'Finland' },
      { country: 'Gabon' },
      { country: 'Ghana' },
      { country: 'Greece' },
      { country: 'Guatemala' },
      { country: 'Honduras' },
      { country: 'Hungary' },
      { country: 'Iceland' },
      { country: 'India' },
      { country: 'Indonesia' },
      { country: 'Iran' },
      { country: 'Iraq' },
      { country: 'Ireland' },
      { country: 'Italy' },
      { country: 'Jamaica' },
      { country: 'Japan' },
      { country: 'Jordan' },
      { country: 'Kazakhstan' },
      { country: 'Kenya' },
      { country: 'Kuwait' },
      { country: 'Latvia' },
      { country: 'Lebanon' },
      { country: 'Liberia' },
      { country: 'Libya' },
      { country: 'Lithuania' },
      { country: 'Luxembourg' },
      { country: 'Malaysia' },
      { country: 'Maldives' },
      { country: 'Mexico' },
      { country: 'Morocco' },
      { country: 'Namibia' },
      { country: 'Nepal' },
      { country: 'Netherlands' },
      { country: 'New Zealand' },
      { country: 'Nigeria' },
      { country: 'Norway' },
      { country: 'Pakistan' },
      { country: 'Panama' },
      { country: 'Peru' },
      { country: 'Philippines' },
      { country: 'Poland' },
      { country: 'Portugal' },
      { country: 'Qatar' },
      { country: 'Romania' },
      { country: 'Saudi Arabia' },
      { country: 'Senegal' },
      { country: 'Somalia' },
      { country: 'South Africa' },
      { country: 'Thailand' },
      { country: 'Tunisia' },
      { country: 'Turkey' },
      { country: 'Uganda' },
      { country: 'Ukraine' },
      { country: 'United Arab Emirates' },
      { country: 'Uruguay' },
      { country: 'Venezuela' },
      { country: 'Zimbabwe' }
    ],
    DISEC: [
      { country: 'China' },
      { country: 'France' },
      { country: 'Russian Federation' },
      { country: 'United Kingdom' },
      { country: 'United States' },
      { country: 'Afghanistan' },
      { country: 'Albania' },
      { country: 'Algeria' },
      { country: 'Angola' },
      { country: 'Argentina' },
      { country: 'Australia' },
      { country: 'Austria' },
      { country: 'Bahrain' },
      { country: 'Bangladesh' },
      { country: 'Belgium' },
      { country: 'Bolivia' },
      { country: 'Brazil' },
      { country: 'Bulgaria' },
      { country: 'Canada' },
      { country: 'Chile' },
      { country: 'Colombia' },
      { country: 'Costa Rica' },
      { country: 'Croatia' },
      { country: 'Cuba' },
      { country: 'Cyprus' },
      { country: 'Democratic Republic of the Congo' },
      { country: 'Denmark' },
      { country: 'Ecuador' },
      { country: 'Egypt' },
      { country: 'Estonia' },
      { country: 'Ethiopia' },
      { country: 'Finland' },
      { country: 'Gabon' },
      { country: 'Ghana' },
      { country: 'Greece' },
      { country: 'Guatemala' },
      { country: 'Honduras' },
      { country: 'Hungary' },
      { country: 'Iceland' },
      { country: 'India' },
      { country: 'Indonesia' },
      { country: 'Iran' },
      { country: 'Iraq' },
      { country: 'Ireland' },
      { country: 'Italy' },
      { country: 'Jamaica' },
      { country: 'Japan' },
      { country: 'Jordan' },
      { country: 'Kazakhstan' },
      { country: 'Kenya' },
      { country: 'Kuwait' },
      { country: 'Latvia' },
      { country: 'Lebanon' },
      { country: 'Liberia' },
      { country: 'Libya' },
      { country: 'Lithuania' },
      { country: 'Luxembourg' },
      { country: 'Malaysia' },
      { country: 'Maldives' },
      { country: 'Mexico' },
      { country: 'Morocco' },
      { country: 'Namibia' },
      { country: 'Nepal' },
      { country: 'Netherlands' },
      { country: 'New Zealand' },
      { country: 'Nigeria' },
      { country: 'Norway' },
      { country: 'Pakistan' },
      { country: 'Panama' },
      { country: 'Peru' },
      { country: 'Philippines' },
      { country: 'Poland' },
      { country: 'Portugal' },
      { country: 'Qatar' },
      { country: 'Romania' },
      { country: 'Saudi Arabia' },
      { country: 'Senegal' },
      { country: 'Somalia' },
      { country: 'South Africa' },
      { country: 'Thailand' },
      { country: 'Tunisia' },
      { country: 'Turkey' },
      { country: 'Uganda' },
      { country: 'Ukraine' },
      { country: 'United Arab Emirates' },
      { country: 'Uruguay' },
      { country: 'Venezuela' },
      { country: 'Zimbabwe' }
    ],
    AIPPM: [
      { country: 'Nirmala Sitharaman', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Finance' },
      { country: 'Amit Shah', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Home Affairs' },
      { country: 'Dharmendra Pradhan', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Education' },
      { country: 'Dr. Subrahmanyam Jaishankar', portfolio: 'Bharatiya Janata Party', minister: 'Minister of External Affairs' },
      { country: 'Ashwini Vaishnaw', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Information & Broadcasting' },
      { country: 'Anupriya Devi', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Women & Child Development' },
      { country: 'Jyotiraditya M. Scindia', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Development of North Eastern Region' },
      { country: 'Jagat Prakash Nadda', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Health' },
      { country: 'Tejasvi Surya', portfolio: 'Bharatiya Janata Party', minister: 'Member of Parliament, Bengaluru South' },
      { country: 'Rajnath Singh', portfolio: 'Bharatiya Janata Party', minister: 'Minister of Defence' },
      { country: 'K Annamalai', portfolio: 'Bharatiya Janata Party', minister: 'Political Leader' },
      { country: 'Yogi Adityanath', portfolio: 'Bharatiya Janata Party', minister: 'Chief Minister of Uttar Pradesh' },
      { country: 'Kangana Ranaut', portfolio: 'Bharatiya Janata Party', minister: 'Member of Parliament, Mandi' },
      { country: 'Eknath Shinde', portfolio: 'Shiv Sena', minister: 'Chief Minister of Maharashtra' },
      { country: 'Chirag Paswan', portfolio: 'Lok Janshakti Party (Ram Vilas)', minister: 'Minister of Food Processing Industries' },
      { country: 'Edapaddi Palaniswami', portfolio: 'All India Anna Dravida Munnetra Kazhagam', minister: 'Leader of Opposition, Tamil Nadu Legislative Assembly' },
      { country: 'H.D. Kumaraswamy', portfolio: 'Janata Dal (Secular)', minister: 'Minister of Heavy Industries & Steel' },
      { country: 'Nitish Kumar', portfolio: 'Janata Dal (United)', minister: 'Chief Minister of Bihar' },
      { country: 'Nara Chandrababu Naidu', portfolio: 'Telugu Desam Party', minister: 'Chief Minister of Andhra Pradesh' },
      { country: 'Jayant Chaudhary', portfolio: 'Rashtriya Lok Dal', minister: 'Minister of State, Education' },
      { country: 'Ramdas Athawale', portfolio: 'Republican Party of India (Athawale)', minister: 'Minister of Social Justice & Empowerment' },
      { country: 'Rahul Gandhi', portfolio: 'Indian National Congress', minister: 'Leader of Opposition' },
      { country: 'Mallikarjun Kharge', portfolio: 'Indian National Congress', minister: 'Member of Parliament' },
      { country: 'Siddaramaiah', portfolio: 'Indian National Congress', minister: 'Chief Minister of Karnataka' },
      { country: 'D.K. Shivakumar', portfolio: 'Indian National Congress', minister: 'Deputy Chief Minister of Karnataka' },
      { country: 'Priyanka Gandhi Vadra', portfolio: 'Indian National Congress', minister: 'Member of Parliament, Wayanad' },
      { country: 'Shashi Tharoor', portfolio: 'Indian National Congress', minister: 'Member of Parliament, Thiruvananthapuram' },
      { country: 'Revanth Reddy', portfolio: 'Indian National Congress', minister: 'Chief Minister of Telangana' },
      { country: 'Atishi Marlena', portfolio: 'Aam Aadmi Party', minister: 'Minister of Education, Delhi' },
      { country: 'Pinarayi Vijayan', portfolio: 'Communist Party of India (Marxist)', minister: 'Chief Minister of Kerala' },
      { country: 'Uddhav Balasaheb Thackeray', portfolio: 'Shiv Sena (UBT)', minister: 'Member of Legislative Council, Maharashtra' },
      { country: 'M.K. Stalin', portfolio: 'Dravida Munnetra Kazhagam', minister: 'Chief Minister of Tamil Nadu' },
      { country: 'Udhayanidhi Stalin', portfolio: 'Dravida Munnetra Kazhagam', minister: 'Minister of Youth Welfare and Sports Development of Tamil Nadu' },
      { country: 'Omar Abdullah', portfolio: 'Jammu & Kashmir National Conference', minister: 'Chief Minister of Jammu and Kashmir' },
      { country: 'Mehbooba Mufti', portfolio: 'Jammu & Kashmir People\'s Democratic Party', minister: 'Political Leader' },
      { country: 'Hemant Soren', portfolio: 'Jharkhand Mukti Morcha', minister: 'Chief Minister of Jharkhand' },
      { country: 'Asaduddin Owaisi', portfolio: 'All India Majlis-e-Ittehadul Muslimeen', minister: 'Member of Parliament, Hyderabad' },
      { country: 'YS Jagan Mohan Reddy', portfolio: 'Yuvajana Sramika Rythu Congress Party', minister: 'Member of Legislative Assembly, Pulivendula' },
      { country: 'Akhilesh Yadav', portfolio: 'Samajwadi Party', minister: 'Political Leader' },
      { country: 'K Chandrashekar Rao', portfolio: 'Bharat Rashtra Samithi', minister: 'Leader of Opposition, Telangana' },
      { country: 'Sachin Pilot', portfolio: 'Indian National Congress', minister: 'Member of Parliament, Dausa' },
      { country: 'Mamata Banerjee', portfolio: 'All India Trinamool Congress', minister: 'Chief Minister of West Bengal' }
    ],
    IP: [
      { country: 'Reporter' },
      { country: 'Photo Journalist' }
    ]
  };

>>>>>>> 3ce65c0051064a2458c9bc2952e76b025ba52578
  useEffect(() => {
    // Simulate loading delay
    setLoading(true);
    setTimeout(() => {
      const savedData = localStorage.getItem('mun_country_matrix');
      if (savedData) {
        setCountryData(JSON.parse(savedData));
      } else {
        setCountryData(staticCountryData);
      }
      setLoading(false);
    }, 1000);
  }, []);

<<<<<<< HEAD
  // Function to filter countries based on search and status
=======
  // Function to filter countries based on search
>>>>>>> 3ce65c0051064a2458c9bc2952e76b025ba52578
  const getFilteredCountries = (committee) => {
    let countries = countryData[committee] || [];

    // Filter by search term
    if (searchTerm) {
      countries = countries.filter(country =>
        country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (country.portfolio && country.portfolio.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (country.minister && country.minister.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return countries;
  };

  const getStats = (committee) => {
    const allCountries = countryData[committee] || [];
    const filteredCountries = getFilteredCountries(committee);
    const total = allCountries.length;
    const filteredTotal = filteredCountries.length;

    return {
      total,
      filteredTotal,
      showingFiltered: filteredTotal !== total || searchTerm
    };
  };

  return (
    <div className="country-matrix">
      <section className="page-header">
        <div className="container">
          <h1>Country Matrix</h1>
          <p>View countries/parties for each committee</p>
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
                    {stats.total} Countries
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
                {getStats(selectedCommittee).showingFiltered && (
                  <div className="stat-box">
                    <div className="stat-label">Showing</div>
                    <div className="stat-value">{getStats(selectedCommittee).filteredTotal}</div>
                  </div>
                )}
              </div>

              <div className="countries-grid">
                {getFilteredCountries(selectedCommittee).length === 0 ? (
                  <div className="no-results">
                    <p>No countries found matching your criteria.</p>
                  </div>
                ) : (
<<<<<<< HEAD
                  getFilteredCountries(selectedCommittee).map((item, index) => {
                    const originalIndex = countryData[selectedCommittee].findIndex(
                      country => country.country === item.country
                    );
                    return (
                      <div
                        key={index}
                        className={`country-card ${item.is_allocated ? 'allocated' : 'available'} ${selectedCommittee === 'AIPPM' ? 'aippm-card' : ''}`}
                        title={item.is_allocated ? `Allocated to ${item.allocated_to}` : 'Available'}
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
=======
                  getFilteredCountries(selectedCommittee).map((item, index) => (
                    <div
                      key={index}
                      className={`country-card ${selectedCommittee === 'AIPPM' ? 'aippm-card' : ''}`}
                    >
                      <div className="country-name">{item.country}</div>
                      {selectedCommittee === 'AIPPM' && (
                        <div className="aippm-details">
                          <div className="portfolio">{item.portfolio}</div>
                          <div className="minister">{item.minister}</div>
>>>>>>> 3ce65c0051064a2458c9bc2952e76b025ba52578
                        </div>
                      )}
                    </div>
                  ))
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
