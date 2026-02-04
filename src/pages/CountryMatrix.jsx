import { useState, useEffect } from 'react';
import { staticCountryData } from '../data/committees';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
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

  useEffect(() => {
    const fetchMatrix = async () => {
      setLoading(true);
      try {
        // Try fetching from Firestore first (Public View)
        const matrixDoc = await getDoc(doc(db, "public", "countryMatrix"));
        let firestoreMatrix = null;
        if (matrixDoc.exists()) {
          firestoreMatrix = matrixDoc.data().matrix;
        } else {
          const savedData = localStorage.getItem('mun_country_matrix');
          if (savedData) firestoreMatrix = JSON.parse(savedData);
        }

        if (firestoreMatrix) {
          const mergedMatrix = {};
          Object.keys(staticCountryData).forEach(committee => {
            mergedMatrix[committee] = staticCountryData[committee].map(staticItem => {
              const firestoreItem = firestoreMatrix[committee]?.find(f => f.country === staticItem.country);
              return {
                ...staticItem,
                is_allocated: firestoreItem ? firestoreItem.is_allocated : false,
                allocated_to: firestoreItem ? firestoreItem.allocated_to : null
              };
            });
          });
          setCountryData(mergedMatrix);
        } else {
          setCountryData(staticCountryData);
        }
      } catch (error) {
        console.error("Error fetching country matrix:", error);
        // Fallback on error
        const savedData = localStorage.getItem('mun_country_matrix');
        if (savedData) {
          setCountryData(JSON.parse(savedData));
        } else {
          setCountryData(staticCountryData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMatrix();
  }, []);

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
