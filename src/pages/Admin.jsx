import { useState, useEffect } from 'react';
import { staticCountryData } from '../data/committees';
import './Admin.css';

function Admin() {
    const [countryData, setCountryData] = useState({
        UNSC: [],
        DISEC: [],
        AIPPM: [],
        IP: []
    });
    const [loading, setLoading] = useState(true);
    const [selectedCommittee, setSelectedCommittee] = useState('UNSC');
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = sessionStorage.getItem('admin_authenticated');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }

        const savedData = localStorage.getItem('mun_country_matrix');
        if (savedData) {
            setCountryData(JSON.parse(savedData));
        } else {
            setCountryData(staticCountryData);
        }
        setLoading(false);
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin@iare') {
            setIsAuthenticated(true);
            sessionStorage.setItem('admin_authenticated', 'true');
        } else {
            showNotification('Incorrect password!');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('admin_authenticated');
    };

    // Inactivity timeout logic (120 seconds)
    useEffect(() => {
        let timeoutId;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (isAuthenticated) {
                timeoutId = setTimeout(() => {
                    handleLogout();
                    showNotification('Session expired due to inactivity');
                }, 120000); // 120 seconds
            }
        };

        if (isAuthenticated) {
            // Events that signify activity
            const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

            // Initialize timer
            resetTimer();

            // Add event listeners
            events.forEach(event => {
                window.addEventListener(event, resetTimer);
            });

            return () => {
                if (timeoutId) clearTimeout(timeoutId);
                events.forEach(event => {
                    window.removeEventListener(event, resetTimer);
                });
            };
        }
    }, [isAuthenticated]);

    const saveData = (newData) => {
        setCountryData(newData);
        localStorage.setItem('mun_country_matrix', JSON.stringify(newData));
        showNotification('Changes saved successfully!');
    };

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const toggleAllocation = (committee, index) => {
        const country = countryData[committee][index];
        if (country.is_allocated) {
            const confirmDeallocate = window.confirm(`Deallocate ${country.country}?`);
            if (confirmDeallocate) {
                const newData = { ...countryData };
                newData[committee][index] = {
                    ...newData[committee][index],
                    is_allocated: false,
                    allocated_to: null
                };
                saveData(newData);
            }
        } else {
            const delegateName = window.prompt(`Enter delegate name for ${country.country}:`);
            if (delegateName !== null) {
                const newData = { ...countryData };
                newData[committee][index] = {
                    ...newData[committee][index],
                    is_allocated: true,
                    allocated_to: delegateName || 'Allocated'
                };
                saveData(newData);
            }
        }
    };

    const resetData = () => {
        if (window.confirm('Are you sure you want to reset ALL data to defaults? This cannot be undone.')) {
            saveData(staticCountryData);
        }
    };

    const exportData = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(countryData, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "country_matrix_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const getFilteredCountries = (committee) => {
        let countries = countryData[committee] || [];
        if (searchTerm) {
            countries = countries.filter(item =>
                item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.allocated_to && item.allocated_to.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        return countries;
    };

    if (loading) return <div className="admin-loading">Loading Admin Panel...</div>;

    if (!isAuthenticated) {
        return (
            <div className="admin-login-overlay">
                <div className="login-card">
                    <h2>Admin Login</h2>
                    <p>Please enter the administrator password to continue.</p>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Enter password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoFocus
                        />
                        <button type="submit">Unlock Dashboard</button>
                    </form>
                    {notification && <div className="login-error">{notification}</div>}
                </div>
            </div>
        );
    }

    return (
        <div className="admin-panel animate-on-load">
            <section className="page-header">
                <div className="container">
                    <div className="header-with-logout">
                        <div className="header-text">
                            <h1>Admin Dashboard</h1>
                            <p className="head">Manage Country Matrix Allotments</p>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </section>

            {notification && <div className="admin-notification">{notification}</div>}

            <section className="section">
                <div className="container">
                    <div className="admin-controls">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Search countries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="action-buttons">
                            <button className="export-btn" onClick={exportData}>Export JSON</button>
                            <button className="reset-btn" onClick={resetData}>Reset Defaults</button>
                        </div>
                    </div>

                    <div className="committee-tabs">
                        {Object.keys(countryData).map(committee => (
                            <button
                                key={committee}
                                className={`tab-button ${selectedCommittee === committee ? 'active' : ''}`}
                                onClick={() => setSelectedCommittee(committee)}
                            >
                                {committee}
                            </button>
                        ))}
                    </div>

                    <div className="admin-matrix-grid">
                        {getFilteredCountries(selectedCommittee).map((item, index) => {
                            // Find original index for state update
                            const originalIndex = countryData[selectedCommittee].findIndex(c => c.country === item.country);

                            return (
                                <div
                                    key={item.country}
                                    className={`admin-country-card ${item.is_allocated ? 'allocated' : 'available'}`}
                                    onClick={() => toggleAllocation(selectedCommittee, originalIndex)}
                                >
                                    <div className="card-info">
                                        <span className="country-label">{item.country}</span>
                                        {item.is_allocated && (
                                            <span className="delegate-label">👤 {item.allocated_to}</span>
                                        )}
                                    </div>
                                    <div className="card-status">
                                        {item.is_allocated ? 'Allocated' : 'Available'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Admin;
