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

  // Function to filter countries based on search term only
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
          <p className="head">Check country/party availability for each committee</p>
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
                    {stats.total} Members
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
                  placeholder="Search candidates..."
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
                  <div className="stat-label">Total Members</div>
                  <div className="stat-value">{getStats(selectedCommittee).total}</div>
                </div>
              </div>

              <div className="countries-grid">
                {getFilteredCountries(selectedCommittee).length === 0 ? (
                  <div className="no-results">
                    <p>No candidates found matching your search.</p>
                  </div>
                ) : (
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
